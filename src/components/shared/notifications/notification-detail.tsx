"use client";
import { format } from "date-fns";
import { Button, GlobalModal } from "@/components";
import { NotificationType } from "@/types";
import { useCurrentNotificationStore, useModal } from "@/stores";

export function NotificationDetail() {
  const { closeModal, open } = useModal();
  const { setCurrentNotification, currentNotification } =
    useCurrentNotificationStore();
  const isOpen = open["notify-detail"];

  if (!isOpen) return null;

  return (
    <GlobalModal
      canClose
      className="w-max"
      id="notify-detail"
      title={currentNotification?.title}
    >
      <div className="space-y-4">
        <p className="text-foreground leading-relaxed whitespace-pre-line">
          {currentNotification?.message}
        </p>

        <div className="text-sm text-foreground">
          Recebida em{" "}
          {format(
            currentNotification?.createdAt || new Date(),
            "dd/MM/yyyy HH:mm"
          )}
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            onClick={() => {
              setCurrentNotification(null);
              closeModal("notify-detail");
            }}
            className="bg-primary/10 text-primary-600"
          >
            Fechar
          </Button>
        </div>
      </div>
    </GlobalModal>
  );
}
