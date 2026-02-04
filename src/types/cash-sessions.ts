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

export type CashSession = {
  id: string;
  openingCash: number;
  storeId: string;
  userId: string;
  closingCash: number;
  totalSales: number;
  notes: string;
  openedAt: string;
  closedAt: string;
  expectedClosingCash: number;
  cashDifference: number;
  duration: string;
  isOpen: boolean;
  fundType: string;
  workTime: string;
  authorizedById: string;
};
