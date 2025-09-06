"use client";

import React, { useEffect, useState } from "react";
import { useNotifications } from "./NotificationProvider";

/**
 * Debug component to show current notification permission status
 * Add this temporarily to see what's happening
 */
export const DebugNotificationStatus: React.FC = () => {
  const { 
    permissionStatus, 
    requiresPermission, 
    permissionState,
    isSubscribed 
  } = useNotifications();
  
  const [browserPermission, setBrowserPermission] = useState<string>('checking...');
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Check browser permission directly
    if ('Notification' in window) {
      setBrowserPermission(Notification.permission);
      
      // Also check what the permission state says
      setDebugInfo({
        browserPermission: Notification.permission,
        contextPermissionStatus: permissionStatus,
        requiresPermission: requiresPermission,
        isSubscribed: isSubscribed,
        permissionState: permissionState,
        shouldShowBanner: permissionStatus === 'denied' && requiresPermission,
        localStorage: {
          pushSubscribed: localStorage.getItem('push-subscribed'),
          notificationsEnabled: localStorage.getItem('notifications-enabled'),
          notificationsDenied: localStorage.getItem('notifications-denied'),
        }
      });
    }
  }, [permissionStatus, requiresPermission, permissionState, isSubscribed]);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black text-white p-4 rounded-lg shadow-xl max-w-md">
      <h3 className="font-bold text-yellow-400 mb-2">🔍 Notification Debug Info</h3>
      <div className="space-y-1 text-xs font-mono">
        <div>Browser Permission: <span className={`font-bold ${browserPermission === 'denied' ? 'text-red-400' : browserPermission === 'granted' ? 'text-green-400' : 'text-yellow-400'}`}>{browserPermission}</span></div>
        <div>Requires Permission: <span className={`font-bold ${requiresPermission ? 'text-green-400' : 'text-red-400'}`}>{String(requiresPermission)}</span></div>
        <div>Is Subscribed: <span className={`font-bold ${isSubscribed ? 'text-green-400' : 'text-red-400'}`}>{String(isSubscribed)}</span></div>
        <div>Should Show Banner: <span className={`font-bold ${debugInfo.shouldShowBanner ? 'text-green-400' : 'text-red-400'}`}>{String(debugInfo.shouldShowBanner)}</span></div>
        
        <div className="mt-2 pt-2 border-t border-gray-600">
          <div className="text-yellow-400">Permission State from Context:</div>
          {permissionState && (
            <>
              <div>- hasPermission: {String(permissionState.hasPermission)}</div>
              <div>- requiresPermission: {String(permissionState.requiresPermission)}</div>
              <div>- userRole: {permissionState.userRole || 'N/A'}</div>
            </>
          )}
        </div>

        <div className="mt-2 pt-2 border-t border-gray-600">
          <details>
            <summary className="cursor-pointer text-yellow-400">Full Debug Info (click to expand)</summary>
            <pre className="mt-2 text-[10px] overflow-auto max-h-40">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-600">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

export default DebugNotificationStatus;
