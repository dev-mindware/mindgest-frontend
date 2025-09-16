"use client";
import { format } from "date-fns";
import { Button } from "@/components";
import { NotificationType } from "@/types";
import { useCurrentNotificationStore, useModal } from "@/stores";

interface NotificationDetailProps {
  notification: NotificationType;
}

export function NotificationDetail({ notification }: NotificationDetailProps) {
  const { closeModal } = useModal();
  const { setCurrentNotification } = useCurrentNotificationStore();

  return (
    <div className="space-y-4">
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {notification.message}
      </p>

      <div className="text-sm text-gray-500">
        Recebida em {format(notification.createdAt, "dd/MM/yyyy HH:mm")}
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          onClick={() => {
            setCurrentNotification(null);
            closeModal("notify-detail");
          }}
          className="bg-primary-100 text-primary-600 hover:bg-primary-300"
        >
          Fechar
        </Button>
      </div>
    </div>
  );
}
