import type { CreateItemData } from "@/types";
import { api } from "./api";

export const itemsService = {
  addItem: async (data: CreateItemData) => {
    return api.post<CreateItemData>("/items", data);
  },
  updateItem: async (id: string, data: CreateItemData) => {
    return api.put<CreateItemData>(`/items/${id}`, data);
  },
  
  toggleStatusItem: async (id: string) => {
    return api.patch<CreateItemData>(`/items/${id}/toggle-status`);
  },

  deleteItem: async (id: string) => {
    return api.delete<CreateItemData>(`/items/${id}`);
  },
};
