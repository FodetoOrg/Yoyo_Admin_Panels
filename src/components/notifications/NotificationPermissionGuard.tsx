"use client";

import React, { useEffect, useState } from "react";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";
import MandatoryNotificationModal from "./MandatoryNotificationModal";
import NotificationPermissionChecker from "./NotificationPermissionChecker";
import GlobalNotificationBanner from "./GlobalNotificationBanner";
import { Loader2 } from "lucide-react";

interface NotificationPermissionGuardProps {
  children: React.ReactNode;
  enforcePermission?: boolean;
  loadingComponent?: React.ReactNode;
  checkInterval?: number;
  showGlobalBanner?: boolean;
  useModal?: boolean;
}

export const NotificationPermissionGuard: React.FC<NotificationPermissionGuardProps> = ({
  children,
  enforcePermission = true,
  loadingComponent,
  checkInterval = 5 * 60 * 1000, // 5 minutes
  showGlobalBanner = true,
  useModal = false,
}) => {
  const {
    permissionState,
    isChecking,
    isBlocked,
    checkNow,
  } = useNotificationPermission({
    checkOnMount: true,
    checkInterval,
    enforcePermission,
  });

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Mark as initialized after first check
    if (permissionState !== null) {
      setHasInitialized(true);
    }
  }, [permissionState]);

  // Check on page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkNow();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Show loading while checking initial permissions
  if (!hasInitialized && isChecking) {
    return loadingComponent || (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking notification permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Permission checker to detect when user manually changes permissions */}
      <NotificationPermissionChecker />
      
      {/* Show global banner at the top of all pages when notifications are blocked */}
      {showGlobalBanner && <GlobalNotificationBanner />}
      
      {/* Show mandatory modal if user is blocked and useModal is true */}
      {useModal && (
        <MandatoryNotificationModal
          isOpen={isBlocked && enforcePermission}
          userRole={permissionState?.userRole}
          message={permissionState?.message}
        />
      )}

      {/* Render children regardless, but modal will block interaction if needed */}
      {children}
    </>
  );
};

export default NotificationPermissionGuard;
