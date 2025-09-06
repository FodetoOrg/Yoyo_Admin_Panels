"use client";

import { useEffect, useRef } from "react";
import { useNotifications } from "./NotificationProvider";

/**
 * Component that periodically checks if notification permissions have changed
 * This is useful when user has denied permissions and needs to manually enable them
 */
export const NotificationPermissionChecker: React.FC = () => {
  const { checkPermissions, permissionStatus } = useNotifications();
  const lastPermissionStatus = useRef<NotificationPermission>(permissionStatus);
  
  useEffect(() => {
    // Check if permission status has changed from denied to default/granted
    const checkPermissionChange = async () => {
      const currentPermission = Notification.permission;
      
      // If permission changed from denied to something else
      if (lastPermissionStatus.current === 'denied' && currentPermission !== 'denied') {
        console.log('Notification permission changed from denied to:', currentPermission);
        
        // Clear denied markers
        localStorage.removeItem('notifications-denied');
        
        // Re-check permissions and potentially subscribe
        await checkPermissions(true);
        
        // If the modal was blocking, this will close it
        if (currentPermission === 'granted') {
          window.location.reload();
        }
      }
      
      lastPermissionStatus.current = currentPermission;
    };

    // Check immediately
    checkPermissionChange();
    
    // Set up periodic checking (every 2 seconds when denied)
    let interval: NodeJS.Timeout | null = null;
    
    if (Notification.permission === 'denied') {
      interval = setInterval(checkPermissionChange, 2000);
    }
    
    // Also check on window focus
    const handleFocus = () => {
      checkPermissionChange();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [permissionStatus, checkPermissions]);
  
  return null; // This is a utility component, doesn't render anything
};

export default NotificationPermissionChecker;
