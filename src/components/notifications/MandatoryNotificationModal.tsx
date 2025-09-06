"use client";

import React, { useState, useEffect } from "react";
import { Bell, AlertTriangle, Shield, Clock, Settings, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNotifications } from "./NotificationProvider";

interface MandatoryNotificationModalProps {
  isOpen: boolean;
  userRole?: string;
  message?: string;
}

export const MandatoryNotificationModal: React.FC<MandatoryNotificationModalProps> = ({
  isOpen,
  userRole = "",
  message = "Notifications are required for your account"
}) => {
  const { forceEnableNotifications, permissionStatus } = useNotifications();
  const [isEnabling, setIsEnabling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [browserName, setBrowserName] = useState<string>("your browser");
  const [isDenied, setIsDenied] = useState(false);

  useEffect(() => {
    // Detect browser type
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome')) setBrowserName('Chrome');
    else if (userAgent.includes('safari')) setBrowserName('Safari');
    else if (userAgent.includes('firefox')) setBrowserName('Firefox');
    else if (userAgent.includes('edge')) setBrowserName('Edge');
    
    // Check if permission is denied
    setIsDenied(Notification.permission === 'denied');
  }, []);

  useEffect(() => {
    // Update denied state when permission status changes
    setIsDenied(permissionStatus === 'denied');
  }, [permissionStatus]);

  if (!isOpen) return null;

  const handleEnableNotifications = async () => {
    // If permission is denied, we can't request it again programmatically
    if (isDenied) {
      setError("Notifications are blocked. Please follow the instructions above to enable them in your browser settings.");
      return;
    }

    setIsEnabling(true);
    setError(null);

    try {
      const success = await forceEnableNotifications();
      
      if (!success) {
        // Check if permission was denied after the attempt
        if (Notification.permission === 'denied') {
          setIsDenied(true);
          setError("You have blocked notifications. Please follow the instructions above to enable them in your browser settings.");
        } else {
          setError("Failed to enable notifications. Please ensure you allow notifications when prompted.");
        }
      }
    } catch (err) {
      setError("An error occurred while enabling notifications. Please try again.");
    } finally {
      setIsEnabling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 border-2 border-orange-200 shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {isDenied ? "Notifications Blocked" : "Enable Notifications Required"}
              </CardTitle>
              {userRole && (
                <CardDescription className="text-sm mt-1">
                  Account Type: <span className="font-semibold">{userRole}</span>
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              {isDenied 
                ? "You have previously blocked notifications. You need to manually enable them in your browser settings to continue."
                : (message || "Your account requires push notifications to be enabled for important updates and alerts.")}
            </p>

            {isDenied && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  How to enable notifications in {browserName}:
                </h4>
                <ol className="space-y-2 text-sm text-yellow-800">
                  {browserName === 'Chrome' || browserName === 'Edge' ? (
                    <>
                      <li>1. Click the lock icon 🔒 in the address bar</li>
                      <li>2. Click "Site settings"</li>
                      <li>3. Find "Notifications" and change to "Allow"</li>
                      <li>4. Refresh this page</li>
                    </>
                  ) : browserName === 'Firefox' ? (
                    <>
                      <li>1. Click the lock icon 🔒 in the address bar</li>
                      <li>2. Click "Connection secure" → "More information"</li>
                      <li>3. Go to "Permissions" tab</li>
                      <li>4. Find "Receive Notifications" and uncheck "Use Default"</li>
                      <li>5. Select "Allow" and refresh this page</li>
                    </>
                  ) : browserName === 'Safari' ? (
                    <>
                      <li>1. Go to Safari → Preferences → Websites</li>
                      <li>2. Click "Notifications" in the left sidebar</li>
                      <li>3. Find this website in the list</li>
                      <li>4. Change the permission to "Allow"</li>
                      <li>5. Refresh this page</li>
                    </>
                  ) : (
                    <>
                      <li>1. Click the lock/info icon in the address bar</li>
                      <li>2. Look for notification or site settings</li>
                      <li>3. Change notifications to "Allow"</li>
                      <li>4. Refresh this page</li>
                    </>
                  )}
                </ol>
                
                <div className="mt-3 pt-3 border-t border-yellow-300">
                  <p className="text-xs text-yellow-700">
                    After enabling notifications in your browser settings, refresh this page and click the button below.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Why notifications are required:
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Security alerts and account protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Time-sensitive booking updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <Bell className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Critical system notifications</span>
                </li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="pt-2">
              {isDenied ? (
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
                  size="lg"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  I've Enabled Notifications - Refresh Page
                </Button>
              ) : (
                <Button
                  onClick={handleEnableNotifications}
                  disabled={isEnabling}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2"
                  size="lg"
                >
                  {isEnabling ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Enabling Notifications...
                    </>
                  ) : (
                    <>
                      <Bell className="h-5 w-5 mr-2" />
                      Enable Notifications Now
                    </>
                  )}
                </Button>
              )}
            </div>

            <p className="text-xs text-gray-500 text-center">
              You must enable notifications to continue using the application.
              {!isDenied && " This is a one-time setup that can be managed in your settings later."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MandatoryNotificationModal;
