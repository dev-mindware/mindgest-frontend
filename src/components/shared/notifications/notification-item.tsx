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

  const getStatusColor = (type: string) => {
    switch (type) {
      case "WARNING": return "bg-yellow-100 text-yellow-700";
      case "ERROR": return "bg-red-100 text-red-700";
      default: return "bg-background text-primary-700"; 
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "WARNING": return "CircleAlert";
      case "ERROR": return "OctagonAlert";
      default: return "Info"; 
    }
  }

  return (
    <div
      className={cn(
        "group flex items-start gap-3 p-4 hover:bg-card transition-colors duration-150 relative cursor-pointer",
        !notification.isRead ? "bg-blue-50/40" : "bg-muted"
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          getStatusColor(notification.type)
        )}
      >
        <Icon name={getIcon(notification.type)} className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              "text-sm font-medium text-foreground line-clamp-1",
              !notification.isRead && "font-bold text-foreground"
            )}
          >
            {notification.title}
          </h4>
          {!notification.isRead && (
            <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-1" />
          )}
        </div>

        <p className={cn("text-sm line-clamp-2 mt-1", !notification.isRead ? "text-gray-700" : "text-gray-500")}>
          {notification.message}
        </p>

        <p className="text-xs text-foreground mt-2">{timeAgo}</p>
      </div>

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
