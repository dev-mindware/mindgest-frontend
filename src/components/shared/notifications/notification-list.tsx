"use client"
import { useEffect } from "react";
import { NotificationItem } from "./notification-item";
import { NotificationType } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInView } from "react-intersection-observer";

interface NotificationListProps {
  notifications: NotificationType[];
  onNotificationClick: (notification: NotificationType) => void;
  deleteNotification: (id: string) => void;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

export function NotificationList({
  notifications,
  onNotificationClick,
  deleteNotification,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
}: NotificationListProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && fetchNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Initial view limit logic? 
  // If we want "show 3 initially", we can just rely on the hook fetching 5. 
  // It's close enough. If strictly 3, we would slice. 
  // But "loader infinito" implies we want to see more as we scroll.
  // The user prompt is a bit contradictory ("show 3" vs "infinite loader"). 
  // "loader infinito PRA QUANDO NÃO CABEREM AS 3" -> Infinite loader when > 3.
  // This implies if there are few, show them. If many, scroll.

  const unreadNotifications = notifications.filter(
    (n) => !n.isRead
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Notificações</h3>
      </div>

      <ScrollArea className="h-72">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="mb-2">📭</div>
            <p className="text-sm">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => onNotificationClick(notification)}
                onDelete={() => deleteNotification(notification.id)}
              />
            ))}

            {(hasNextPage || isFetchingNextPage) && (
              <div ref={ref} className="p-4 flex justify-center">
                {isFetchingNextPage ? (
                  <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-xs text-gray-400">Carregando mais...</span>
                )}
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}