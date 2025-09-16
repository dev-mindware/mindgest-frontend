"use client";

import { NotificationItem } from "./notification-item";
import type { NotificationType } from "@/types";

interface NotificationListProps {
  notifications: NotificationType[];
  searchTerm: string;
  filterStatus: "all" | "read" | "unread";
  onNotificationClick: (notification: NotificationType) => void;
  deleteNotification: (id: string) => void;
}

export function NotificationList({
  notifications,
  searchTerm,
  filterStatus,
  onNotificationClick,
  deleteNotification,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="mb-4 text-4xl">📭</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma notificação encontrada
        </h3>
        <p className="text-gray-500">
          {searchTerm || filterStatus !== "all"
            ? "Tente limpar os filtros para ver todas."
            : "Você não possui notificações no momento."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="hover:bg-gray-50 transition-colors"
          >
            <NotificationItem
              notification={notification}
              onClick={() => onNotificationClick(notification)}
              onDelete={() => deleteNotification(notification.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
