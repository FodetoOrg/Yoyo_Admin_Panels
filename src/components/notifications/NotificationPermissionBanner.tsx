"use client";

import React, { useState, useEffect } from "react";
import { Bell, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WebPushClient } from "@/lib/utils/webPushClient";
import { CONSTANTS } from "@/lib/utils/constants";

interface NotificationPermissionBannerProps {
  onPermissionGranted?: () => void;
  onDismiss?: () => void;
  forceShow?: boolean;
}

export const NotificationPermissionBanner: React.FC<NotificationPermissionBannerProps> = ({
  onPermissionGranted,
  onDismiss,
  forceShow = false
}) => {
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [webPushClient, setWebPushClient] = useState<WebPushClient | null>(null);

  useEffect(() => {
    const checkPermissionStatus = async () => {
      // Don't show banner if permission is already granted
      if (Notification.permission === 'granted') {
        return;
      }

      // If forceShow is true, always show the banner
      if (!forceShow) {
        // Don't show if user has dismissed it recently (only for auto-show)
        const dismissed = localStorage.getItem('notification-banner-dismissed');
        const dismissedTime = dismissed ? parseInt(dismissed) : 0;
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      
        if (dismissedTime > oneDayAgo) {
          return;
        }
      }

      // Initialize web push client
      const authToken = getCookie(CONSTANTS.ACCESS_TOKEN_KEY);
      const client = new WebPushClient({ authToken });
      setWebPushClient(client);
      
      // Check if already subscribed
      const isSubscribed = await client.checkExistingSubscription();
      
      // Show banner if not subscribed and permission is default, or if forced
      if ((!isSubscribed && Notification.permission === 'default') || forceShow) {
        setShowBanner(true);
      }
    };

    checkPermissionStatus();
  }, [forceShow]);

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const handleEnableNotifications = async () => {
    if (!webPushClient) return;
    
    setLoading(true);
    try {
      await webPushClient.subscribe();
      setShowBanner(false);
      onPermissionGranted?.();
    } catch (error) {
      console.error('Failed to enable notifications:', error);
      // Don't hide banner on error, let user try again
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    if (!forceShow) {
      localStorage.setItem('notification-banner-dismissed', Date.now().toString());
    }
    onDismiss?.();
  };

  if (!showBanner) {
    return null;
  }

  return (
    <Card className={`mx-4 mb-4 border-blue-200 bg-blue-50 ${forceShow ? 'border-2' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Bell className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-blue-900">
              Stay Updated with Push Notifications
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Get instant notifications for new bookings, payments, and important updates. 
              You can disable this anytime in settings.
            </p>
            
            <div className="flex items-center gap-2 mt-3">
              <Button
                size="sm"
                onClick={handleEnableNotifications}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Enabling...' : 'Enable Notifications'}
              </Button>
              {!forceShow && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                >
                  Not now
                </Button>
              )}
            </div>
          </div>
          
          {!forceShow && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPermissionBanner;