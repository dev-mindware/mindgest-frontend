import {
  CashSession,
  CashSessionFilters,
  CashSessionRequest,
} from "@/types/cash-sessions";
import { api } from "./api";

export const cashSessionsService = {
  getOpeningRequests: async (filters?: CashSessionFilters) => {
    const params = new URLSearchParams();

    if (filters?.storeId) params.append("storeId", filters.storeId);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.userId) params.append("userId", filters.userId);

    const { data } = await api.get<CashSessionRequest[]>(
      `/cash-sessions/opening-requests?${params.toString()}`,
    );
    return data;
  },

  openSession: async (data: any) => {
    const response = await api.post("/cash-sessions/opening-sessions", data);
    return response.data;
  },

  getCurrentSession: async (storeId?: string) => {
    const params = storeId ? { storeId } : {};

    // We pass storeId if explicitly provided, otherwise interceptor handles it
    // Mock data fallback forced for now as per previous requirement
    return {
      id: "mock-session-id",
      openingCash: 100,
      storeId: storeId || "mock-store-id",
      userId: "user-id",
      closingCash: 0,
      totalSales: 250.5,
      notes: "Sessão de turnos da manhã",
      openedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      closedAt: "",
      expectedClosingCash: 0,
      cashDifference: 0,
      duration: "02:00",
      isOpen: true,
      fundType: "Dinheiro",
      workTime: "08:00",
      authorizedById: "Gerente Silva",
    } as CashSession;
  },

  requestOpening: async (data: { storeId?: string; message: string }) => {
    const response = await api.post("/cash-sessions/request-opening", data);
    return response.data;
  },

  registerExpense: async (data: {
    description: string;
    amount: number;
    storeId: string;
    cashSessionId: string;
  }) => {
    const response = await api.post("/cash-sessions/expenses", data);
    return response.data;
  },

  closeSession: async (
    id: string,
    data: { closingCash: number; totalSales: number; notes: string },
  ) => {
    const response = await api.patch(`/cash-sessions/${id}/close`, data);
    return response.data;
  },
};
