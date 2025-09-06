import { apiService, notificationApi, type WebPushSubscription } from "./api";

export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: any;
  requireInteraction?: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  tag?: string;
}

export class WebPushClient {
  private apiUrl: string;
  private authToken: string | null;
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;
  private vapidPublicKey: string | null = null;

  constructor(options: { apiUrl?: string; authToken?: string } = {}) {
    this.apiUrl = options.apiUrl || '/api/v1/web-push';
    this.authToken = options.authToken || null;

    this.init();
  }

  async init(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.error('Service Worker not supported');
      return;
    }

    if (!('PushManager' in window)) {
      console.error('Web Push not supported');
      return;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');

      // Get VAPID public key
      await this.getVapidPublicKey();

      // Check existing subscription
      await this.checkExistingSubscription();

    } catch (error) {
      console.error('Failed to initialize Web Push client:', error);
    }
  }

  async getVapidPublicKey(): Promise<void> {
    try {
      const response = await apiService.get<any>(`${this.apiUrl}/vapid-public-key`);

      if (response && response.success) {
        this.vapidPublicKey = response.data?.publicKey;
      }
    } catch (error) {
      console.error('Failed to get VAPID public key:', error);
    }
  }

  async checkExistingSubscription(): Promise<boolean> {
    try {
      if (!this.registration) return false;

      this.subscription = await this.registration.pushManager.getSubscription();

      if (this.subscription) {
        console.log('Existing web push subscription found, validating with backend...');
        
        // Always validate with backend to ensure DB row exists
        try {
          const subscriptionJson = this.subscription.toJSON();
          const keys = subscriptionJson.keys as { p256dh: string; auth: string };
          
          const statusResponse = await notificationApi.checkSubscriptionStatus(
            this.subscription.endpoint,
            keys.p256dh,
            keys.auth
          );
          
          if (statusResponse.data.hasValidSubscription && !statusResponse.data.needsUpdate) {
            // Subscription is valid in both browser and backend
            localStorage.setItem('push-subscribed', 'true');
            return true;
          } else {
            // DB row is missing or keys don't match - need to resubscribe
            console.warn('Browser subscription exists but backend validation failed, need to resubscribe');
            localStorage.removeItem('push-subscribed');
            
            // Trigger resubscription
            await this.subscribe();
            return true;
          }
        } catch (error) {
          console.error('Backend validation failed:', error);
          // If backend check fails, assume subscription is invalid
          localStorage.removeItem('push-subscribed');
          return false;
        }
      }

      localStorage.removeItem('push-subscribed');
      return false;
    } catch (error) {
      console.error('Failed to check existing subscription:', error);
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    // Check if permission is already denied
    if (Notification.permission === 'denied') {
      console.warn('Notification permission is already denied. User must enable it manually in browser settings.');
      throw new Error('Notification permission is blocked. Please enable it in your browser settings.');
    }

    // Only request if permission is 'default'
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        if (permission === 'denied') {
          // Store that permission was denied
          localStorage.setItem('notifications-denied', 'true');
          localStorage.setItem('notifications-denied-time', Date.now().toString());
        }
        throw new Error('Notification permission denied');
      }

      return permission;
    }

    return Notification.permission;
  }

  async subscribe(): Promise<boolean> {
    try {
      // Check if permission is denied first
      if (Notification.permission === 'denied') {
        console.error('Cannot subscribe: Notification permission is denied in browser settings');
        return false;
      }

      // Request notification permission if needed
      await this.requestPermission();

      if (!this.vapidPublicKey) {
        await this.getVapidPublicKey();
      }

      if (!this.registration) {
        throw new Error('Service Worker not registered');
      }

      // Check if we already have a subscription
      const existingSubscription = await this.registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        // Check if the existing subscription is valid
        const subscriptionJson = existingSubscription.toJSON();
        const keys = subscriptionJson.keys as { p256dh: string; auth: string };
        
        // Check subscription status with backend
        const statusResponse = await notificationApi.checkSubscriptionStatus(
          existingSubscription.endpoint,
          keys.p256dh,
          keys.auth
        );

        if (statusResponse.data.needsUpdate) {
          // Unsubscribe the old subscription
          await existingSubscription.unsubscribe();
        } else if (statusResponse.data.hasValidSubscription) {
          // Subscription is valid, no need to create new one
          this.subscription = existingSubscription;
          localStorage.setItem('push-subscribed', 'true');
          return true;
        }
      }

      // Create new subscription
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey!)
      });

      // Send subscription to server using the new API
      const subscriptionData: WebPushSubscription = {
        endpoint: this.subscription.endpoint,
        keys: {
          p256dh: (this.subscription.toJSON().keys as any).p256dh,
          auth: (this.subscription.toJSON().keys as any).auth
        }
      };

      const response = await notificationApi.subscribe(subscriptionData);

      console.log('response from backend is ', response)

      if (response.success) {
        console.log('Successfully subscribed to web push notifications');
        console.log('Action:', response.data.action);
        localStorage.setItem('push-subscribed', 'true');
        localStorage.setItem('push-subscription-time', Date.now().toString());
        return true;
      } else {
        throw new Error(response.message);
      }

    } catch (error) {
      console.error('Failed to subscribe to web push notifications:', error);
      throw error;
    }
  }

  async unsubscribe(): Promise<boolean> {
    try {
      if (!this.subscription) {
        console.log('No active subscription to unsubscribe');
        localStorage.removeItem('push-subscribed');
        return true;
      }

      // Unsubscribe from browser
      const success = await this.subscription.unsubscribe();

      if (success) {
        // Remove subscription from server
        await apiService.post(`${this.apiUrl}/unsubscribe`, {
          endpoint: this.subscription.endpoint
        });

        this.subscription = null;
        localStorage.removeItem('push-subscribed');
        console.log('Successfully unsubscribed from web push notifications');
        return true;
      }

      return false;

    } catch (error) {
      console.error('Failed to unsubscribe from web push notifications:', error);
      throw error;
    }
  }

  async sendTestNotification(message: string): Promise<any> {
    try {
      const response = await apiService.post<any>(`${this.apiUrl}/test`, { message });

      if (response && response.success) {
        console.log('Test notification sent successfully');
        return response;
      } else {
        throw new Error(response?.message || 'Failed to send test notification');
      }

    } catch (error) {
      console.error('Failed to send test notification:', error);
      throw error;
    }
  }

  isSubscribed(): boolean {
    return this.subscription !== null;
  }

  getSubscription(): PushSubscription | null {
    return this.subscription;
  }

  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  // Helper function to convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// Helper function to get cookie
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}