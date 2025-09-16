"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "./notification-item";
import type { NotificationType } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotificationListProps {
  notifications: NotificationType[];
  onNotificationClick: (notification: NotificationType) => void;
  deleteNotification: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationList({
  notifications,
  onNotificationClick,
  onMarkAllAsRead,
  deleteNotification,
}: NotificationListProps) {
  // const { currentRole } = useCurrentRole()
  const unreadNotifications = notifications.filter(
    (n) => n.status === "unread"
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Notificações</h3>
        {unreadNotifications.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
            className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 text-sm"
          >
            Marcar todas como lidas
          </Button>
        )}
      </div>

      <ScrollArea className="max-h-96">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="mb-2">📭</div>
            <p className="text-sm">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.slice(0, 3).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => onNotificationClick(notification)}
                onDelete={() => deleteNotification(notification.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <Link href={`/${"user"}/notifications`}>
            <Button
              variant="ghost"
              className="w-full text-primary-600 hover:text-primary-700 hover:bg-primary-50 text-sm"
            >
              Ver todas as notificações
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}