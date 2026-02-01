import { CashSessionFilters, CashSessionRequest } from "@/types/cash-sessions";
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
};
