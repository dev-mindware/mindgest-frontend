
export type NotificationType = {
  id: string;
  title: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
  url?: string | null;
}

export interface NotificationResponse {
  data: NotificationType[];
  total: number;
  page: number;
  pageCount: number;
}
