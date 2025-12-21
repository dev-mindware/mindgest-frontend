import type { SupplierData } from "@/types";
import { api } from "./api";

export const suppliersService = {
  addSupplier: async (data: SupplierData) => {
    return api.post<SupplierData>("/suppliers", data);
  },
  updateSupplier: async (id: string, data: SupplierData) => {
    return api.put<SupplierData>(`/suppliers/${id}`, data);
  },
  deleteSupplier: async (id: string) => {
    return api.delete<SupplierData>(`/suppliers/${id}`);
  },
  getSuppliers: async () => {
    return api.get("/suppliers");
  },
};
