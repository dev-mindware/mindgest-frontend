import { api } from "./api";
import type { InvoicePayload } from "@/types";

export const invoiceService = {
  createInvoice: async (data: InvoicePayload) => {
    return api.post("/invoice/normal", data);
  },
  generateReceipt: async (id: string, data: InvoicePayload) => {
    return api.post(`/invoice/${id}/receipt`, data);
  },
  cancelInvoice: async (id: string) => {
    return api.delete(`/invoice/${id}/cancel`);
  },
};

