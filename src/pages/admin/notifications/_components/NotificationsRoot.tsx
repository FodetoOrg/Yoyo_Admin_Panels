// src/components/notifications/NotificationsRoot.tsx
import React from "react";

import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import NotificationsScreen from "./NotificationsScreen";

export default function NotificationsRoot(props: {
  initialNotifications: any[];
  initialUnreadCount: number;
}) {
  const { initialNotifications, initialUnreadCount } = props;
  return (
    <NotificationProvider>
      <NotificationsScreen
        initialNotifications={initialNotifications}
        initialUnreadCount={initialUnreadCount}
      />
    </NotificationProvider>
  );
}
