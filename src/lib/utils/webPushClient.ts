import { apiService } from "./api";

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
      const response = await apiService.get(`${this.apiUrl}/vapid-public-key`);

      if (response.success) {
        this.vapidPublicKey = response.data.publicKey;
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
        console.log('Existing web push subscription found');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to check existing subscription:', error);
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    return permission;
  }

  async subscribe(): Promise<boolean> {
    try {
      // Request notification permission
      await this.requestPermission();

      if (!this.vapidPublicKey) {
        await this.getVapidPublicKey();
      }

      if (!this.registration) {
        throw new Error('Service Worker not registered');
      }

      // Create subscription
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey!)
      });

      // Send subscription to server
      const response = await apiService.post(`${this.apiUrl}/subscribe`, {
        subscription: this.subscription.toJSON()
      });

      console.log('response from backend is ', response)

      if (response.success) {
        console.log('Successfully subscribed to web push notifications');
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
      const response = await apiService.post(`${this.apiUrl}/test`, { message });

      if (response.success) {
        console.log('Test notification sent successfully');
        return response;
      } else {
        throw new Error(response.message);
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
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}