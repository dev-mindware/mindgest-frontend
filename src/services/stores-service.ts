import type { StoreData } from "@/types";
import { api } from "./api";

export const storesService = {
  addStore: async (data: StoreData) => {
    return api.post<StoreData>("/stores", data);
  },
  updateStore: async (id: string, data: StoreData) => {
    return api.put<StoreData>(`/stores/${id}`, data);
  },
  deleteStore: async (id: string) => {
    return api.delete<StoreData>(`/stores/${id}`);
  },
  getStores: async () => {
    return api.get("/stores");
  },
  toggleStatusStore: async (id: string) => {
    return api.patch<StoreData>(`/stores/${id}/toggle-status`);
  },
};
