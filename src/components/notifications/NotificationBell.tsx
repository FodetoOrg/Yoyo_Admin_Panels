"use client";

import React, { useState, useEffect } from "react";
import { Bell, BellRing, X, Check, Eye, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WebPushClient } from "@/lib/utils/webPushClient";
import { apiService } from "@/lib/utils/api";
import { CONSTANTS } from "@/lib/utils/constants";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

interface NotificationBellProps {
  userId?: string;
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ 
  userId, 
  className = "" 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [webPushClient, setWebPushClient] = useState<WebPushClient | null>(null);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  // Ensure component is mounted before accessing browser APIs
  useEffect(() => {
    setMounted(true);
  }, []);
  // Initialize web push client
  useEffect(() => {
    if (!mounted) return;
    
    const initWebPush = async () => {
      // Check if notifications are supported
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        console.log('Notifications not supported');
        return;
      }

      const authToken = getCookie(CONSTANTS.ACCESS_TOKEN_KEY);
      if (!authToken) {
        console.log('No auth token found');
        return;
      }

      const client = new WebPushClient({ authToken });
      setWebPushClient(client);
      
      // Check permission status
      setPushPermission(Notification.permission);
      
      // Check if already subscribed
      const subscribed = await client.checkExistingSubscription();
      setIsSubscribed(subscribed);

      // Auto-request permission if it's default and not subscribed
      if (Notification.permission === 'default' && !subscribed) {
        try {
          const permission = await Notification.requestPermission();
          setPushPermission(permission);
          
          if (permission === 'granted') {
            // Auto-subscribe after permission granted
            try {
              await client.subscribe();
              setIsSubscribed(true);
            } catch (subscribeError) {
              console.error('Auto-subscribe failed:', subscribeError);
            }
          }
        } catch (permissionError) {
          console.error('Permission request failed:', permissionError);
        }
      }
    };

    initWebPush();
  }, [mounted]);

  // Fetch notifications
  useEffect(() => {
    if (!mounted) return;
    
    const fetchNotifications = async () => {
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

    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Helper function to get cookie
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const handleSubscribeToPush = async () => {
    if (!webPushClient) return;
    
    setLoading(true);
    try {
      await webPushClient.subscribe();
      setIsSubscribed(true);
      setPushPermission('granted');
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      alert('Failed to enable notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribeFromPush = async () => {
    if (!webPushClient) return;
    
    setLoading(true);
    try {
      await webPushClient.unsubscribe();
      setIsSubscribed(false);
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      alert('Failed to disable notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await apiService.put(`/api/v1/notifications/${notificationId}/read`);
      if (response.success) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
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

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const response = await apiService.delete(`/api/v1/notifications/${notificationId}`);
      if (response.success) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        setUnreadCount(prev => {
          const notification = notifications.find(n => n.id === notificationId);
          return notification && !notification.isRead ? Math.max(0, prev - 1) : prev;
        });
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleSendTestNotification = async () => {
    if (!webPushClient) return;
    
    try {
      await webPushClient.sendTestNotification('This is a test notification from your hotel admin dashboard!');
      
      // Play notification sound immediately for test
      playNotificationSound();
      
      alert('Test notification sent! Check your browser notifications.');
    } catch (error) {
      console.error('Failed to send test notification:', error);
      alert('Failed to send test notification. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return '📅';
      case 'payment':
        return '💳';
      case 'refund':
        return '💰';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  // Don't render on server
  if (!mounted) {
    return (
      <div className={`relative ${className}`}>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          disabled
        >
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    );
  }
  return (
    <div className={`relative ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
          >
            {unreadCount > 0 ? (
              <BellRing className="h-5 w-5" />
            ) : (
              <Bell className="h-5 w-5" />
            )}
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Notification Settings</DialogTitle>
                    <DialogDescription>
                      Manage your web push notification preferences
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex flex-col gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Web Push Notifications</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Permission Status:</span>
                          <Badge variant={
                            pushPermission === 'granted' ? 'default' : 
                            pushPermission === 'denied' ? 'destructive' : 'secondary'
                          }>
                            {pushPermission}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Subscription Status:</span>
                          <Badge variant={isSubscribed ? 'default' : 'secondary'}>
                            {isSubscribed ? 'Subscribed' : 'Not Subscribed'}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {!isSubscribed ? (
                            <Button 
                              onClick={handleSubscribeToPush}
                              disabled={loading || pushPermission === 'denied'}
                              size="sm"
                            >
                              {loading ? 'Subscribing...' : 'Enable Push Notifications'}
                            </Button>
                          ) : (
                            <Button 
                              onClick={handleUnsubscribeFromPush}
                              disabled={loading}
                              variant="outline"
                              size="sm"
                            >
                              {loading ? 'Unsubscribing...' : 'Disable Push Notifications'}
                            </Button>
                          )}
                          
                          {isSubscribed && (
                            <Button 
                              onClick={handleSendTestNotification}
                              variant="outline"
                              size="sm"
                            >
                              Send Test Notification
                            </Button>
                          )}
                        </div>
                        
                        {pushPermission === 'denied' && (
                          <div className="text-xs text-muted-foreground p-2 bg-yellow-50 border border-yellow-200 rounded">
                            Notifications are blocked. Please enable them in your browser settings.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>
              
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>
          </div>
          
          <ScrollArea className="h-80">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-muted/50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notification.isRead ? 'font-semibold' : 'font-medium'}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.body}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleDeleteNotification(notification.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {notification.data?.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 h-7 text-xs"
                            onClick={() => {
                              window.location.href = notification.data.url;
                              handleMarkAsRead(notification.id);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t">
              <Button 
                variant="ghost" 
                className="w-full text-sm"
                onClick={() => {
                  window.location.href = '/admin/notifications';
                  setIsOpen(false);
                }}
              >
                View All Notifications
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationBell;