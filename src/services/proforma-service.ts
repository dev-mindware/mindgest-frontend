import { api } from "./api";
import type { ProformaPayload } from "@/types";

export const proformaService = {
  createProforma: async (data: ProformaPayload) => {
    return api.post("/invoice/proforma", data);
  },
  getProformas: async () => {
    return api.get("/invoice/proforma");
  },
  getProformaById: async (id: string) => {
    return api.get(`/invoice/proforma/${id}`);
  },
  deleteProforma: async (id: string) => {
    return api.delete(`/invoices/${id}`);
  },
  updateProforma: async (id: string, data: ProformaPayload) => {
    return api.put(`/invoices/${id}`, data);
  },
};
