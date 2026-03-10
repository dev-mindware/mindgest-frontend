"use client";
import { useState, useMemo } from "react";
import { useNotifications } from "@/hooks";
import { TitleList, Button, Icon } from "@/components";
import { AllNotificationsSkeleton } from "@/components/common/skeletons";
import { NotificationList } from "./notification-list";
import { NotificationFilters } from "./notification-filters";
import Link from "next/link";
import { NotificationParams } from "@/types/notification";

export function AllNotifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "read" | "unread">(
    "all",
  );
  const [filterType, setFilterType] = useState<
    "all" | "INFO" | "WARNING" | "ERROR"
  >("all");

  const apiFilters = useMemo(() => {
    const filters: Omit<NotificationParams, "skip" | "take"> = {};
    if (filterStatus === "read") filters.isRead = true;
    if (filterStatus === "unread") filters.isRead = false;
    if (filterType !== "all") filters.type = filterType;
    return filters;
  }, [filterStatus, filterType]);

  const {
    notifications,
    isLoading,
    markAsRead,
    handleNotificationClick,
    deleteNotification,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications(apiFilters);

  if (isLoading) return <AllNotificationsSkeleton />;

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const unreadCount = notifications.filter((n) => n.isRead === false).length;

  const handleMarkAllAsRead = () => {
    const unreadFiltered = notifications.filter((n) => n.isRead === false);
    unreadFiltered.forEach((n) => markAsRead(n.id));
  };

  return (
    <div className="space-y-6">
      <TitleList
        title="Notificações"
        suTitle="Mantenha-se atualizado com suas atividades e mensagens"
      >
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <Icon name="CheckCheck" className="mr-2 h-4 w-4" />
              Marcar tudo como lido
            </Button>
          )}
          <Link href="/settings?tab=notifications">
            <Button>
              <Icon name="Settings" className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          </Link>
        </div>
      </TitleList>

      <NotificationFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      <div className="bg-card rounded-xl border shadow-sm">
        <NotificationList
          className="h-auto min-h-[15rem] max-h-[calc(100vh-20rem)]"
          notifications={filteredNotifications}
          onNotificationClick={handleNotificationClick}
          deleteNotification={deleteNotification}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
}
