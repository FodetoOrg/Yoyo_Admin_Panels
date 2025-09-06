"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, X, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "./NotificationProvider";

interface NotificationBlockedBannerProps {
  alwaysShow?: boolean; // Force show even if dismissed
  className?: string;
}

export const NotificationBlockedBanner: React.FC<NotificationBlockedBannerProps> = ({
  alwaysShow = false,
  className = ""
}) => {
  const { permissionStatus, requiresPermission } = useNotifications();
  const [showBanner, setShowBanner] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [browserName, setBrowserName] = useState<string>("your browser");

  useEffect(() => {
    // Detect browser type
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome')) setBrowserName('Chrome');
    else if (userAgent.includes('safari') && !userAgent.includes('chrome')) setBrowserName('Safari');
    else if (userAgent.includes('firefox')) setBrowserName('Firefox');
    else if (userAgent.includes('edge')) setBrowserName('Edge');

    // Check if banner was dismissed in this session
    const dismissed = sessionStorage.getItem('notification-banner-dismissed');
    if (dismissed === 'true' && !alwaysShow) {
      setIsDismissed(true);
    }
  }, [alwaysShow]);

  useEffect(() => {
    // Show banner if notifications are blocked/denied and required
    const shouldShow = 
      permissionStatus === 'denied' && 
      requiresPermission && 
      !isDismissed &&
      !alwaysShow;
    
    setShowBanner(shouldShow || (alwaysShow && permissionStatus === 'denied'));
  }, [permissionStatus, requiresPermission, isDismissed, alwaysShow]);

  const handleDismiss = () => {
    setShowBanner(false);
    setIsDismissed(true);
    sessionStorage.setItem('notification-banner-dismissed', 'true');
  };

  const handleOpenSettings = () => {
    // Show instructions modal or guide
    const message = `To enable notifications in ${browserName}:\n\n` +
      (browserName === 'Chrome' || browserName === 'Edge' 
        ? '1. Click the lock icon 🔒 in the address bar\n2. Click "Site settings"\n3. Find "Notifications" and change to "Allow"\n4. Refresh this page'
        : browserName === 'Firefox'
        ? '1. Click the lock icon 🔒 in the address bar\n2. Click "Connection secure" → "More information"\n3. Go to "Permissions" tab\n4. Find "Receive Notifications" and select "Allow"\n5. Refresh this page'
        : browserName === 'Safari'
        ? '1. Go to Safari → Preferences → Websites\n2. Click "Notifications" in the left sidebar\n3. Find this website and change to "Allow"\n4. Refresh this page'
        : '1. Click the lock/info icon in the address bar\n2. Look for notification settings\n3. Change to "Allow"\n4. Refresh this page');
    
    alert(message);
  };

  if (!showBanner) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Notifications are blocked. Please enable them in your browser settings and refresh the page.</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenSettings}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Settings className="h-4 w-4 mr-1" />
                How to Enable
              </Button>
              
              {!alwaysShow && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBlockedBanner;
