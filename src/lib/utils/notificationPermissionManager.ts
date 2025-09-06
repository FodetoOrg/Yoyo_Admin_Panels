import { notificationApi, type PermissionValidation, type SubscriptionStatus, type WebPushSubscription } from './api';
import { WebPushClient } from './webPushClient';

export interface NotificationPermissionState {
  hasPermission: boolean;
  isSubscribed: boolean;
  needsUpdate: boolean;
  requiresPermission: boolean;
  userRole: string;
  message: string;
}

export class NotificationPermissionManager {
  private static instance: NotificationPermissionManager | null = null;
  private webPushClient: WebPushClient | null = null;
  private isChecking: boolean = false;
  private lastCheckTime: number = 0;
  private readonly CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): NotificationPermissionManager {
    if (!NotificationPermissionManager.instance) {
      NotificationPermissionManager.instance = new NotificationPermissionManager();
    }
    return NotificationPermissionManager.instance;
  }

  /**
   * Initialize the permission manager with auth token
   */
  public async initialize(authToken: string): Promise<void> {
    if (!this.webPushClient) {
      this.webPushClient = new WebPushClient({ authToken });
      await this.webPushClient.init();
    }
  }

  /**
   * Main method to check and validate notification permissions
   * This should be called on login and page reload
   */
  public async checkAndValidatePermissions(forceCheck = false): Promise<NotificationPermissionState> {
    // Prevent concurrent checks
    if (this.isChecking) {
      return this.getCurrentState();
    }

    // Check if we've recently checked (unless forced)
    if (!forceCheck && Date.now() - this.lastCheckTime < this.CHECK_INTERVAL) {
      return this.getCurrentState();
    }

    this.isChecking = true;

    try {
      // 1. Check browser notification permission
      const browserPermission = Notification.permission;
      
      // 2. Validate permissions with backend
      const validationResponse = await notificationApi.validatePermissions();
      const validation = validationResponse.data;

      // 3. Get current subscription if exists
      const subscription = await this.webPushClient?.getSubscription();
      
      // 4. Check subscription status with backend
      let subscriptionStatus: SubscriptionStatus | null = null;
      let hasValidSubscription = false;
      
      if (subscription) {
        // If we have a browser subscription, validate it with backend
        const keys = JSON.parse(JSON.stringify(subscription.toJSON())).keys;
        const statusResponse = await notificationApi.checkSubscriptionStatus(
          subscription.endpoint,
          keys.p256dh,
          keys.auth
        );
        console.log('statusResponse from backend is ', statusResponse)
        subscriptionStatus = statusResponse.data;
        hasValidSubscription = subscriptionStatus.hasValidSubscription && !subscriptionStatus.needsUpdate;
      } else {
        // No browser subscription, so definitely not subscribed
        hasValidSubscription = false;
      }

      // 5. Determine if we need to update subscription
      const needsUpdate = subscriptionStatus?.needsUpdate || false;
      
      // 6. If subscription needs update or doesn't exist but is required
      if (needsUpdate || (validation.requiresPermission && !subscription)) {
        await this.handleSubscriptionUpdate(subscription || null);
      }

      this.lastCheckTime = Date.now();

      return {
        hasPermission: browserPermission === 'granted',
        isSubscribed: hasValidSubscription,
        needsUpdate,
        requiresPermission: validation.requiresPermission,
        userRole: validation.userRole,
        message: validation.message
      };

    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return this.getCurrentState();
    } finally {
      this.isChecking = false;
    }
  }

  /**
   * Handle subscription update or creation
   */
  private async handleSubscriptionUpdate(existingSubscription: PushSubscription | null): Promise<void> {
    if (!this.webPushClient) {
      throw new Error('WebPushClient not initialized');
    }

    try {
      // If we have an existing subscription with different keys, unsubscribe first
      if (existingSubscription) {
        await existingSubscription.unsubscribe();
      }

      // Subscribe with new keys
      const newSubscription = await this.webPushClient.subscribe();
      
      if (!newSubscription) {
        throw new Error('Failed to create subscription');
      }

    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  /**
   * Force enable notifications (used when user must enable notifications)
   */
  public async forceEnableNotifications(): Promise<boolean> {
    if (!this.webPushClient) {
      throw new Error('WebPushClient not initialized');
    }

    try {
      // Check current permission status
      const currentPermission = Notification.permission;
      
      // If permission is denied, we cannot request it again programmatically
      if (currentPermission === 'denied') {
        console.warn('Notification permission is denied. User must manually enable it in browser settings.');
        return false;
      }

      // Request permission if not granted
      if (currentPermission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          // Permission was denied by the user
          return false;
        }
      }

      // Subscribe to push notifications
      const success = await this.webPushClient.subscribe();
      
      if (success) {
        // Mark that user has enabled notifications
        localStorage.setItem('notifications-enabled', 'true');
        localStorage.setItem('notifications-enabled-time', Date.now().toString());
        // Clear any denied state markers
        localStorage.removeItem('notifications-denied');
      }

      return success;

    } catch (error) {
      console.error('Error forcing notification enable:', error);
      return false;
    }
  }

  /**
   * Check if notifications are denied in browser
   */
  public isPermissionDenied(): boolean {
    return Notification.permission === 'denied';
  }

  /**
   * Store that permission was denied for tracking
   */
  public markPermissionDenied(): void {
    localStorage.setItem('notifications-denied', 'true');
    localStorage.setItem('notifications-denied-time', Date.now().toString());
  }

  /**
   * Get current notification state
   */
  private getCurrentState(): NotificationPermissionState {
    const browserPermission = Notification.permission;
    const isSubscribed = localStorage.getItem('push-subscribed') === 'true';
    
    return {
      hasPermission: browserPermission === 'granted',
      isSubscribed,
      needsUpdate: false,
      requiresPermission: false,
      userRole: '',
      message: ''
    };
  }

  /**
   * Check if notifications were recently enabled (within last 24 hours)
   */
  public wasRecentlyEnabled(): boolean {
    const enabledTime = localStorage.getItem('notifications-enabled-time');
    if (!enabledTime) return false;
    
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    return parseInt(enabledTime) > oneDayAgo;
  }

  /**
   * Clear notification permission manager state
   */
  public clearState(): void {
    this.webPushClient = null;
    this.lastCheckTime = 0;
    this.isChecking = false;
  }
}

// Export singleton instance
export const notificationPermissionManager = NotificationPermissionManager.getInstance();
