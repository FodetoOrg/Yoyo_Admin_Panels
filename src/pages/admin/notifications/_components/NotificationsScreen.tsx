"use client";

import React, { useState, useEffect } from "react";
import PageContainer from "@/components/PageContainer";
import { Heading } from "@/components/Heading";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  BellRing, 
  Settings, 
  Trash2, 
  Check, 
  CheckCheck,
  Send,
  RefreshCw
} from "lucide-react";
import { apiService } from "@/lib/utils/api";
import { useNotifications } from "@/components/notifications/NotificationProvider";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

interface NotificationsScreenProps {
  initialNotifications?: Notification[];
  initialUnreadCount?: number;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  initialNotifications = [],
  initialUnreadCount = 0
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const {
    isSubscribed,
    permissionStatus,
    subscribe,
    unsubscribe,
    webPushClient
  } = useNotifications();

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await apiService.get('/api/v1/notifications');
      if (response.success) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await apiService.put(`/api/v1/notifications/${notificationId}/read`);
      if (response.success) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await apiService.put('/api/v1/notifications/mark-all-read');
      if (response.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const response = await apiService.delete(`/api/v1/notifications/${notificationId}`);
      if (response.success) {
        const notification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        if (notification && !notification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    try {
      const response = await apiService.post('/api/v1/notifications/bulk-delete', {
        notificationIds: selectedRows
      });
      
      if (response.success) {
        const deletedNotifications = notifications.filter(n => selectedRows.includes(n.id));
        const unreadDeleted = deletedNotifications.filter(n => !n.isRead).length;
        
        setNotifications(prev => prev.filter(n => !selectedRows.includes(n.id)));
        setUnreadCount(prev => Math.max(0, prev - unreadDeleted));
        setSelectedRows([]);
      }
    } catch (error) {
      console.error('Failed to delete notifications:', error);
    }
  };

  const handleSendTestNotification = async () => {
    if (!webPushClient) return;
    
    try {
      await webPushClient.sendTestNotification('Test notification from admin dashboard!');
    } catch (error) {
      console.error('Failed to send test notification:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return '📅';
      case 'payment':
        return '💳';
      case 'refund':
        return '💰';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => {
            table.toggleAllPageRowsSelected(e.target.checked);
            if (e.target.checked) {
              setSelectedRows(notifications.map(n => n.id));
            } else {
              setSelectedRows([]);
            }
          }}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.original.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(prev => [...prev, row.original.id]);
            } else {
              setSelectedRows(prev => prev.filter(id => id !== row.original.id));
            }
          }}
        />
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">{getNotificationIcon(row.getValue("type"))}</span>
          <Badge variant="outline" className="capitalize">
            {row.getValue("type")}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className={`font-medium ${!row.original.isRead ? 'text-blue-600' : ''}`}>
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "body",
      header: "Message",
      cell: ({ row }) => (
        <div className="max-w-xs truncate text-sm text-muted-foreground">
          {row.getValue("body")}
        </div>
      ),
    },
    {
      accessorKey: "isRead",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("isRead") ? "secondary" : "default"}>
          {row.getValue("isRead") ? "Read" : "Unread"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <div className="text-sm">
          {formatDate(row.getValue("createdAt"))}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {!row.original.isRead && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleMarkAsRead(row.original.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700"
            onClick={() => handleDeleteNotification(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Heading
            title="Notifications"
            description="Manage your notifications and push notification settings"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={fetchNotifications}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <BellRing className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Push Status</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant={isSubscribed ? "default" : "secondary"}>
                {isSubscribed ? "Enabled" : "Disabled"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Permission</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant={
                permissionStatus === 'granted' ? 'default' : 
                permissionStatus === 'denied' ? 'destructive' : 'secondary'
              }>
                {permissionStatus}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Push Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Push Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Web Push Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Get instant notifications for bookings, payments, and updates
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!isSubscribed ? (
                  <Button onClick={subscribe} disabled={permissionStatus === 'denied'}>
                    <Bell className="h-4 w-4 mr-2" />
                    Enable Notifications
                  </Button>
                ) : (
                  <Button onClick={unsubscribe} variant="outline">
                    <BellRing className="h-4 w-4 mr-2" />
                    Disable Notifications
                  </Button>
                )}
                
                {isSubscribed && (
                  <Button onClick={handleSendTestNotification} variant="outline">
                    <Send className="h-4 w-4 mr-2" />
                    Test
                  </Button>
                )}
              </div>
            </div>
            
            {permissionStatus === 'denied' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  Notifications are blocked. Please enable them in your browser settings and refresh the page.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedRows.length} notification{selectedRows.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      selectedRows.forEach(id => handleMarkAsRead(id));
                      setSelectedRows([]);
                    }}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark Read
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notifications Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Notifications ({notifications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={notifications}
              filterFields={["type", "isRead"]}
              datePickers={["createdAt"]}
              isLoading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default NotificationsScreen;