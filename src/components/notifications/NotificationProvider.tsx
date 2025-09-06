"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { WebPushClient } from "@/lib/utils/webPushClient";
import { apiService, notificationApi, type NotificationItem } from "@/lib/utils/api";
import { CONSTANTS } from "@/lib/utils/constants";
import { notificationPermissionManager, type NotificationPermissionState } from "@/lib/utils/notificationPermissionManager";

interface NotificationContextType {
  webPushClient: WebPushClient | null;
  isSubscribed: boolean;
  permissionStatus: NotificationPermission;
  permissionState: NotificationPermissionState | null;
  unreadCount: number;
  notifications: NotificationItem[];
  isLoadingNotifications: boolean;
  requiresPermission: boolean;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  checkPermissions: (forceCheck?: boolean) => Promise<NotificationPermissionState>;
  forceEnableNotifications: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  userId 
}) => {
  const [webPushClient, setWebPushClient] = useState<WebPushClient | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [permissionState, setPermissionState] = useState<NotificationPermissionState | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [requiresPermission, setRequiresPermission] = useState(false);

  // Helper function to get cookie
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  // Function to play notification sound
  const playNotificationSound = () => {
    try {
      // Create audio context for notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a big notification sound (very loud and longer)
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
      oscillator.frequency.setValueAtTime(1400, audioContext.currentTime + 0.4);
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.6);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.8);
      
      // Very high volume (0.8) and longer duration (1.0 seconds)
      gainNode.gain.setValueAtTime(0.8, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1.0);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  };

  // Listen for messages from service worker
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PLAY_NOTIFICATION_SOUND') {
        playNotificationSound();
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
    };
  }, []);

  // Initialize web push client and check permissions on mount/reload
  useEffect(() => {
    const initWebPush = async () => {
      const authToken = getCookie(CONSTANTS.ACCESS_TOKEN_KEY);
      if (!authToken) {
        console.log('No auth token found, skipping notification initialization');
        return;
      }

      // Initialize the permission manager
      await notificationPermissionManager.initialize(authToken);
      
      // Initialize web push client
      const client = new WebPushClient({ authToken });
      setWebPushClient(client);
      
      // Check permission status
      setPermissionStatus(Notification.permission);
      
      // Perform comprehensive permission check with backend validation
      const state = await notificationPermissionManager.checkAndValidatePermissions();
      setPermissionState(state);
      setRequiresPermission(state.requiresPermission);
      
      // Use the backend-validated subscription status
      setIsSubscribed(state.isSubscribed);
      
      console.log('Notification State:', {
        browserPermission: Notification.permission,
        isSubscribed: state.isSubscribed,
        needsUpdate: state.needsUpdate,
        requiresPermission: state.requiresPermission,
        hasPermission: state.hasPermission
      });
      
      // If user is required to have notifications but doesn't, we'll handle it
      if (state.requiresPermission && !state.isSubscribed) {
        console.warn('User requires notification permissions but is not subscribed');
        // The UI should show a mandatory notification permission banner
      }
    };

    initWebPush();
    
    // Re-check permissions when window regains focus
    const handleFocus = () => {
      initWebPush();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Fetch notifications (today only by default)
  const refreshNotifications = useCallback(async () => {
    setIsLoadingNotifications(true);
    try {
      // Get today's notifications by default
      const response = await notificationApi.getNotifications(1, 10, true);
      if (response.success) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    refreshNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const subscribe = async (): Promise<boolean> => {
    if (!webPushClient) return false;
    
    try {
      const success = await webPushClient.subscribe();
      if (success) {
        // Re-validate with backend to get the updated state
        const state = await notificationPermissionManager.checkAndValidatePermissions();
        setPermissionState(state);
        setIsSubscribed(state.isSubscribed);
        setPermissionStatus('granted');
        
        console.log('After subscribe - Notification State:', {
          isSubscribed: state.isSubscribed,
          needsUpdate: state.needsUpdate,
          hasPermission: state.hasPermission
        });
      }
      return success;
    } catch (error) {
      console.error('Failed to subscribe:', error);
      return false;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    if (!webPushClient) return false;
    
    try {
      const success = await webPushClient.unsubscribe();
      if (success) {
        // Re-validate with backend to get the updated state
        const state = await notificationPermissionManager.checkAndValidatePermissions();
        setPermissionState(state);
        setIsSubscribed(state.isSubscribed);
        
        console.log('After unsubscribe - Notification State:', {
          isSubscribed: state.isSubscribed,
          needsUpdate: state.needsUpdate,
          hasPermission: state.hasPermission
        });
      }
      return success;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      return false;
    }
  };

  const markAsRead = async (id: string): Promise<void> => {
    try {
      const response = await notificationApi.markAsRead(id);
      if (response.success) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    try {
      const response = await notificationApi.markAllAsRead();
      if (response.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string): Promise<void> => {
    try {
      const response = await notificationApi.deleteNotification(id);
      if (response.success) {
        const notification = notifications.find(n => n.id === id);
        setNotifications(prev => prev.filter(n => n.id !== id));
        if (notification && !notification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // Check permissions (can be called manually)
  const checkPermissions = async (forceCheck = false): Promise<NotificationPermissionState> => {
    const state = await notificationPermissionManager.checkAndValidatePermissions(forceCheck);
    setPermissionState(state);
    setRequiresPermission(state.requiresPermission);
    setIsSubscribed(state.isSubscribed);
    return state;
  };

  // Force enable notifications (when required)
  const forceEnableNotifications = async (): Promise<boolean> => {
    try {
      const success = await notificationPermissionManager.forceEnableNotifications();
      if (success) {
        setIsSubscribed(true);
        setPermissionStatus('granted');
        await checkPermissions(true);
      }
      return success;
    } catch (error) {
      console.error('Failed to force enable notifications:', error);
      return false;
    }
  };

  const value: NotificationContextType = {
    webPushClient,
    isSubscribed,
    permissionStatus,
    permissionState,
    unreadCount,
    notifications,
    isLoadingNotifications,
    requiresPermission,
    subscribe,
    unsubscribe,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    checkPermissions,
    forceEnableNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};