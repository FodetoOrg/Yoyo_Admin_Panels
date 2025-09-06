"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Bell, ChevronRight, RefreshCw } from "lucide-react";

/**
 * Simplified notification banner that ALWAYS shows when notifications are denied
 * No dependency on backend requiresPermission flag
 */
export const SimpleNotificationBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [browserName, setBrowserName] = useState<string>("your browser");
  const [permissionStatus, setPermissionStatus] = useState<string>("checking");

  useEffect(() => {
    // Detect browser type
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome') && !userAgent.includes('edge')) setBrowserName('Chrome');
    else if (userAgent.includes('safari') && !userAgent.includes('chrome')) setBrowserName('Safari');
    else if (userAgent.includes('firefox')) setBrowserName('Firefox');
    else if (userAgent.includes('edge')) setBrowserName('Edge');
    else setBrowserName('your browser');

    // Check permission status immediately
    const checkPermission = () => {
      if ('Notification' in window) {
        const status = Notification.permission;
        setPermissionStatus(status);
        setShowBanner(status === 'denied');
        
        console.log('[SimpleNotificationBanner] Permission check:', {
          status,
          willShowBanner: status === 'denied'
        });
      }
    };

    // Initial check
    checkPermission();

    // Check periodically
    const interval = setInterval(checkPermission, 2000);

    // Check on focus
    const handleFocus = () => checkPermission();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Apply body padding when banner is shown
  useEffect(() => {
    if (showBanner) {
      document.body.style.paddingTop = isExpanded ? '200px' : '56px';
      document.body.style.transition = 'padding-top 0.3s ease';
    } else {
      document.body.style.paddingTop = '0';
    }

    return () => {
      document.body.style.paddingTop = '0';
    };
  }, [showBanner, isExpanded]);

  if (!showBanner) {
    console.log('[SimpleNotificationBanner] Not showing - permission is:', permissionStatus);
    return null;
  }

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

  return (
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
                    Notifications are blocked - Please enable them to use all features
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
                      onClick={() => window.location.reload()}
                      className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      I've Enabled - Refresh Now
                    </button>
                    
                    <span className="text-xs opacity-80">
                      Status: {permissionStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleNotificationBanner;
