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
  cancelProforma: async (id: string) => {
    return api.delete(`/invoice/proforma/${id}/cancel`);
  },
};
