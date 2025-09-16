"use client";

import { useEffect } from "react";
import { api } from "@/services/api";
// import { io, Socket } from "socket.io-client";
import {
  useQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { NotificationType, NotificationResponse } from "@/types";
import { useModal } from "@/stores/use-modal-store";
import { useCurrentNotificationStore } from "@/stores";
import { Socket } from "dgram";

//let socket: Socket | null = null;

export function useNotifications() {
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const { setCurrentNotification } = useCurrentNotificationStore();

  const { data: notificationsResponse } = useQuery<NotificationResponse>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get<NotificationResponse>("/notification/my");
      return res.data;
    },
    staleTime: 1000 * 60,
  });

  const notifications = notificationsResponse?.data ?? [];
  const total = notificationsResponse?.total ?? 0;
  const page = notificationsResponse?.page ?? 1;
  const pageCount = notificationsResponse?.pageCount ?? 0;

 /*  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_API_URL!, {
        transports: ["websocket"],
      });
    }

    socket.on("new_notification", (n: NotificationType) => {
      queryClient.setQueryData<NotificationResponse>(
        ["notifications"],
        (old) => {
          if (!old) {
            return { data: [n], total: 1, page: 1, pageCount: 1 };
          }
          return {
            ...old,
            data: [n, ...old.data],
            total: old.total + 1,
          };
        }
      );
    });

    return () => {
      socket?.off("new_notification");
    };
  }, [queryClient]);
 */
  const { mutateAsync: markAsRead } = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notification/${id}/read`);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData<NotificationResponse>([
        "notifications",
      ]);

      queryClient.setQueryData<NotificationResponse>(
        ["notifications"],
        (old) =>
          old
            ? {
                ...old,
                data: old.data.map((n) =>
                  n.id === id ? { ...n, status: "read" } : n
                ),
              }
            : old
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notifications"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const { mutateAsync: markAllAsRead } = useMutation({
    mutationFn: async () => {
      await api.patch(`/notification/read-all`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData<NotificationResponse>([
        "notifications",
      ]);

      queryClient.setQueryData<NotificationResponse>(
        ["notifications"],
        (old) =>
          old
            ? {
                ...old,
                data: old.data.map((n) => ({ ...n, status: "read" })),
              }
            : old
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notifications"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const { mutateAsync: deleteNotification } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/notification/${id}/delete`);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData<NotificationResponse>([
        "notifications",
      ]);

      queryClient.setQueryData<NotificationResponse>(
        ["notifications"],
        (old) =>
          old
            ? {
                ...old,
                data: old.data.filter((n) => n.id !== id),
                total: old.total - 1,
              }
            : old
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notifications"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleNotificationClick = (notification: NotificationType) => {
    openModal("notify-detail");
    setCurrentNotification(notification);
    markAsRead(notification.id);
  };

  return {
    page,
    total,
    pageCount,
    markAsRead,
    markAllAsRead,
    notifications,
    deleteNotification,
    handleNotificationClick,
  };
}