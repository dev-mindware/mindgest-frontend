import type { ItemData } from "@/types";
import { api } from "./api";

export const itemsService = {
  addItem: async (data: ItemData) => {
    return api.post<ItemData>("/items", data);
  },
  updateItem: async (id: string, data: ItemData) => {
    return api.put<ItemData>(`/items/${id}`, data);
  },
  deleteItem: async (id: string) => {
    return api.delete<ItemData>(`/items/${id}`);
  },
};
