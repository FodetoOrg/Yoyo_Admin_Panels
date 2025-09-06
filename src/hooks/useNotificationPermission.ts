"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import type { NotificationPermissionState } from "@/lib/utils/notificationPermissionManager";

interface UseNotificationPermissionOptions {
  checkOnMount?: boolean;
  checkInterval?: number; // in milliseconds
  enforcePermission?: boolean;
}

interface UseNotificationPermissionReturn {
  permissionState: NotificationPermissionState | null;
  isChecking: boolean;
  requiresPermission: boolean;
  isBlocked: boolean;
  checkNow: () => Promise<void>;
  enableNotifications: () => Promise<boolean>;
}

export const useNotificationPermission = (
  options: UseNotificationPermissionOptions = {}
): UseNotificationPermissionReturn => {
  const {
    checkOnMount = true,
    checkInterval = 5 * 60 * 1000, // 5 minutes default
    enforcePermission = true
  } = options;

  const { 
    permissionState, 
    requiresPermission, 
    checkPermissions, 
    forceEnableNotifications 
  } = useNotifications();

  const [isChecking, setIsChecking] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [localPermissionState, setLocalPermissionState] = useState<NotificationPermissionState | null>(null);

  // Check permissions on mount
  useEffect(() => {
    if (checkOnMount) {
      checkNow();
    }
  }, [checkOnMount]);

  // Set up interval checking
  useEffect(() => {
    if (checkInterval > 0) {
      const interval = setInterval(() => {
        checkNow();
      }, checkInterval);

      return () => clearInterval(interval);
    }
  }, [checkInterval]);

  // Update blocked state based on permission state
  useEffect(() => {
    if (enforcePermission && permissionState) {
      const shouldBlock = permissionState.requiresPermission && !permissionState.isSubscribed;
      setIsBlocked(shouldBlock);
    }
  }, [permissionState, enforcePermission]);

  const checkNow = async () => {
    if (isChecking) return;

    setIsChecking(true);
    try {
      const state = await checkPermissions(false);
      setLocalPermissionState(state);
    } catch (error) {
      console.error("Failed to check notification permissions:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const enableNotifications = async (): Promise<boolean> => {
    try {
      const success = await forceEnableNotifications();
      if (success) {
        // Re-check permissions after enabling
        await checkNow();
      }
      return success;
    } catch (error) {
      console.error("Failed to enable notifications:", error);
      return false;
    }
  };

  return {
    permissionState: localPermissionState || permissionState,
    isChecking,
    requiresPermission,
    isBlocked,
    checkNow,
    enableNotifications
  };
};

export default useNotificationPermission;
