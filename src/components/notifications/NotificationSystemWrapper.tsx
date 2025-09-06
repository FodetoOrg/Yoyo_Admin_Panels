"use client";

import React from "react";
import { NotificationProvider } from "./NotificationProvider";
import { NotificationPermissionGuard } from "./NotificationPermissionGuard";

interface NotificationSystemWrapperProps {
  children?: React.ReactNode;
  showBanner?: boolean;
  showModal?: boolean;
}

/**
 * All-in-one wrapper component for the notification system
 * Easy to integrate into any Astro layout
 */
export const NotificationSystemWrapper: React.FC<NotificationSystemWrapperProps> = ({ 
  children,
  showBanner = true,
  showModal = false 
}) => {
  return (
    <NotificationProvider>
      <NotificationPermissionGuard
        showGlobalBanner={showBanner}
        useModal={showModal}
        enforcePermission={true}
      >
        {children}
      </NotificationPermissionGuard>
    </NotificationProvider>
  );
};

export default NotificationSystemWrapper;
