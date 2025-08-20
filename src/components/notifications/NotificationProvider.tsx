"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { WebPushClient } from "@/lib/utils/webPushClient";
import { apiService } from "@/lib/utils/api";
import { CONSTANTS } from "@/lib/utils/constants";

interface NotificationContextType {
  webPushClient: WebPushClient | null;
  isSubscribed: boolean;
  permissionStatus: NotificationPermission;
  unreadCount: number;
  notifications: any[];
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
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
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Helper function to get cookie
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  // Initialize web push client
  useEffect(() => {
    const initWebPush = async () => {
      const authToken = getCookie(CONSTANTS.ACCESS_TOKEN_KEY);
      const client = new WebPushClient({ authToken });
      setWebPushClient(client);
      
      // Check permission status
      setPermissionStatus(Notification.permission);
      
      // Check if already subscribed
      const subscribed = await client.checkExistingSubscription();
      setIsSubscribed(subscribed);
    };

    initWebPush();
  }, []);

  // Fetch notifications
  const refreshNotifications = async () => {
    try {
      const response = await apiService.get('/api/v1/notifications');
      if (response.success) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

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
        setIsSubscribed(true);
        setPermissionStatus('granted');
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
        setIsSubscribed(false);
      }
      return success;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      return false;
    }
  };

  const markAsRead = async (id: string): Promise<void> => {
    try {
      const response = await apiService.put(`/api/v1/notifications/${id}/read`);
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
      const response = await apiService.put('/api/v1/notifications/mark-all-read');
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
      const response = await apiService.delete(`/api/v1/notifications/${id}`);
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

  const value: NotificationContextType = {
    webPushClient,
    isSubscribed,
    permissionStatus,
    unreadCount,
    notifications,
    subscribe,
    unsubscribe,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};