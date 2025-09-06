"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Bell, ChevronRight, RefreshCw } from "lucide-react";
import { useNotifications } from "./NotificationProvider";

export const GlobalNotificationBanner: React.FC = () => {
  const { permissionStatus, requiresPermission, checkPermissions } = useNotifications();
  const [showBanner, setShowBanner] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [browserName, setBrowserName] = useState<string>("your browser");
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Detect browser type
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome') && !userAgent.includes('edge')) setBrowserName('Chrome');
    else if (userAgent.includes('safari') && !userAgent.includes('chrome')) setBrowserName('Safari');
    else if (userAgent.includes('firefox')) setBrowserName('Firefox');
    else if (userAgent.includes('edge')) setBrowserName('Edge');
    else setBrowserName('your browser');
  }, []);

  useEffect(() => {
    // Debug logging
    console.log('[GlobalNotificationBanner] Status Check:', {
      permissionStatus,
      requiresPermission,
      browserPermission: typeof window !== 'undefined' ? Notification.permission : 'unknown',
      willShowBanner: permissionStatus === 'denied'
    });
    
    // Show banner if notifications are denied/blocked
    // For now, show banner whenever permission is denied (for debugging)
    // You can change back to: permissionStatus === 'denied' && requiresPermission
    setShowBanner(permissionStatus === 'denied');
  }, [permissionStatus, requiresPermission]);

  // Check if permission has changed
  useEffect(() => {
    if (!showBanner) return;

    const checkPermissionStatus = async () => {
      const currentPermission = Notification.permission;
      
      // If permission changed from denied to granted
      if (currentPermission === 'granted') {
        setIsChecking(true);
        await checkPermissions(true);
        // The page should reload or update automatically
        window.location.reload();
      }
    };

    // Check every 3 seconds when banner is showing
    const interval = setInterval(checkPermissionStatus, 3000);
    
    // Also check on window focus
    const handleFocus = () => checkPermissionStatus();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [showBanner, checkPermissions]);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!showBanner) return null;

  const getInstructions = () => {
    switch(browserName) {
      case 'Chrome':
      case 'Edge':
        return (
          <ol className="list-decimal list-inside space-y-1">
            <li>Click the lock icon 🔒 in the address bar above</li>
            <li>Click on "Site settings"</li>
            <li>Find "Notifications" and change it to "Allow"</li>
            <li>Click the refresh button below or press F5</li>
          </ol>
        );
      case 'Firefox':
        return (
          <ol className="list-decimal list-inside space-y-1">
            <li>Click the lock icon 🔒 in the address bar</li>
            <li>Click on "Connection secure" → "More information"</li>
            <li>Go to the "Permissions" tab</li>
            <li>Find "Receive Notifications" and select "Allow"</li>
            <li>Click the refresh button below</li>
          </ol>
        );
      case 'Safari':
        return (
          <ol className="list-decimal list-inside space-y-1">
            <li>Go to Safari menu → Preferences → Websites</li>
            <li>Click "Notifications" in the left sidebar</li>
            <li>Find this website in the list</li>
            <li>Change the permission to "Allow"</li>
            <li>Click the refresh button below</li>
          </ol>
        );
      default:
        return (
          <ol className="list-decimal list-inside space-y-1">
            <li>Open your browser settings</li>
            <li>Find notification or site permissions</li>
            <li>Allow notifications for this website</li>
            <li>Click the refresh button below</li>
          </ol>
        );
    }
  };

  // Apply padding to body dynamically
  useEffect(() => {
    if (showBanner) {
      document.body.style.paddingTop = isExpanded ? '200px' : '56px';
      document.body.style.transition = 'padding-top 0.3s ease';
    } else {
      document.body.style.paddingTop = '0';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.paddingTop = '0';
    };
  }, [showBanner, isExpanded]);

  return (
    <>

      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white shadow-xl animate-gradient-x">
        <div className="relative">
          {/* Main Banner */}
          <div className="px-4 py-3">
            <div className="container mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0 animate-pulse">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm md:text-base font-semibold flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications are blocked - You must enable them to continue using this application
                    </p>
                  </div>

                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-2 p-2 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="Toggle instructions"
                  >
                    <ChevronRight 
                      className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Instructions */}
          {isExpanded && (
            <div className="bg-black/20 backdrop-blur border-t border-white/20">
              <div className="container mx-auto px-4 py-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
                    📋 How to enable notifications in {browserName}:
                  </h3>
                  
                  <div className="text-sm space-y-3">
                    {getInstructions()}
                    
                    <div className="pt-3 border-t border-white/20 flex items-center gap-3">
                      <button
                        onClick={handleRefresh}
                        disabled={isChecking}
                        className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
                        {isChecking ? 'Checking...' : "I've Enabled - Refresh Now"}
                      </button>
                      
                      <span className="text-xs opacity-80">
                        This page will automatically refresh when notifications are enabled
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Animated border effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-white to-yellow-400 animate-shimmer" />
      </div>
    </>
  );
};

export default GlobalNotificationBanner;
