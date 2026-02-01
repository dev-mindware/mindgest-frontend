export type CashSessionRequest = {
  id: string;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED"; // Assuming other statuses based on PENDING
  userId: string;
  storeId: string;
  createdAt: string;
  userName: string;
};

export type CashSessionFilters = {
  storeId?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED" | null;
  userId?: string;
};
