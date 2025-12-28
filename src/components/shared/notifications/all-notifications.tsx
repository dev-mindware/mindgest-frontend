"use client";
import { useState } from "react";
import { useNotifications } from "@/hooks";
import { NotificationHeader } from "./notification-header";
import { NotificationFilters } from "./notification-filters";
import { NotificationList } from "./notification-page-list";
import { InfoBanner, PageWrapper } from "@/components/common";

export function AllNotifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "read" | "unread">(
    "all"
  );

  const {
    notifications,
    markAsRead,
    handleNotificationClick,
    deleteNotification,
  } = useNotifications();

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || filterStatus === n.status;

    return matchesSearch && matchesStatus;
  });

  const unreadCount = notifications.filter((n) => n.status === "unread").length;
  const selectedUnreadCount = filteredNotifications.filter(
    (n) => n.status === "unread"
  ).length;

  const handleMarkAllFilteredAsRead = () => {
    const unreadFiltered = filteredNotifications.filter(
      (n) => n.status === "unread"
    );
    unreadFiltered.forEach((n) => markAsRead(n.id));
  };

  return (
    <PageWrapper subRoute="notificacoes">
      <InfoBanner
        title="Notificações"
        description="Gerencie suas notificações e acompanhe todas elas"
      >
        <NotificationHeader
          unreadCount={unreadCount}
          selectedUnreadCount={selectedUnreadCount}
          onMarkAllFilteredAsRead={handleMarkAllFilteredAsRead}
        />
      </InfoBanner>

      <NotificationFilters
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        setSearchTerm={setSearchTerm}
        setFilterStatus={setFilterStatus}
      />

      <div className="bg-sidebar p-4 w-full rounded-lg border-border">
        <NotificationList
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          notifications={filteredNotifications}
          onNotificationClick={handleNotificationClick}
          deleteNotification={deleteNotification}
        />
      </div>
    </PageWrapper>
  );
}