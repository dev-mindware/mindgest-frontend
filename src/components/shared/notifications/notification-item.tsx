"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { NotificationType } from "@/types";
import { Icon, Button } from "@/components";

interface NotificationItemProps {
  notification: NotificationType;
  onClick: () => void;
  onDelete: () => void;
}

export function NotificationItem({
  notification,
  onClick,
  onDelete,
}: NotificationItemProps) {
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <div
      className={cn(
        "group flex items-start gap-3 p-4 hover:bg-primary-50 transition-colors duration-150 relative",
        notification.status === "unread" && "bg-primary-50/30"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-300/10 flex items-center justify-center"
        )}
      >
        <Icon name="Bell" className="w-4 h-4 text-primary-700" />
      </div>

      <button onClick={onClick} className="flex-1 min-w-0 text-left">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              "text-sm font-medium text-foreground line-clamp-1",
              notification.status === "unread" && "font-semibold"
            )}
          >
            {notification.title}
          </h4>
          {notification.status === "unread" && (
            <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-1" />
          )}
        </div>

        <p className="text-sm text-foreground line-clamp-2 mt-1">
          {notification.message.length > 200
            ? `${notification.message.substring(0, 200)}...`
            : notification.message}
        </p>

        <p className="text-xs text-foreground mt-2">{timeAgo}</p>
      </button>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Icon name="Trash2" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
