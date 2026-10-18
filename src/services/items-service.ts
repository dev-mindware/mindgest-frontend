import type { CreateItemData, ImportItemsResult } from "@/types";
import { BarCode } from "@/types/bar-code";
import { api } from "./api";

export const itemsService = {
  addItem: async (data: CreateItemData) => {
    return api.post<CreateItemData>("/items", data);
  },
  updateItem: async (id: string, data: Partial<CreateItemData>) => {
    return api.put<CreateItemData>(`/items/${id}`, data);
  },

  toggleStatusItem: async (id: string) => {
    return api.patch<CreateItemData>(`/items/${id}/toggle-status`);
  },

  deleteItem: async (id: string) => {
    return api.delete<CreateItemData>(`/items/${id}`);
  },

  importExcel: async (file: File, dryRun: boolean, storeId?: string) => {
    const form = new FormData();
    form.append("file", file);
    form.append("dryRun", String(dryRun));
    if (storeId) form.append("storeId", storeId);
    // Content-Type multipart (com boundary) é definido pelo browser
    const response = await api.post<ImportItemsResult>(
      "/items/import/excel",
      form,
      { headers: { "Content-Type": undefined } },
    );
    return response.data;
  },

  downloadImportTemplate: async (plan?: string) => {
    const response = await api.get<Blob>("/items/import/template", {
      params: plan ? { plan } : undefined,
      responseType: "blob",
    });
    return response.data;
  },

  checkBarcode: async (barcode: string) => {
    const response = await api.get<BarCode>("/items/check-barcode", {
      params: { barcode },
    });
    return response.data;
  },
};
