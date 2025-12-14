import { CreditNoteFormData } from "@/schemas";
import { api } from "./api";
import type { InvoicePayload } from "@/types";

export type ReceiptData = {
  originalInvoiceId: string;
  issueDate: string;
  paymentMethod: "CASH" | "CARD" | "TRANSFER";
  notes: string;
};

export const invoiceService = {
  createInvoice: async (data: InvoicePayload) => {
    return api.post("/invoice/normal", data);
  },
  generateReceipt: async (data: ReceiptData) => {
    return api.post(`/invoice/receipt`, data);
  },
  cancelInvoice: async (id: string) => {
    return api.patch(`/invoice/normal/${id}/cancel`);
  },
  getInvoice: async (id: string) => {
    const response = await api.get(`/invoice/normal/${id}`);
    return response.data;
  },
  createCreditNote: async (id: string, data: CreditNoteFormData) => {
    return api.post(`/credit-note/${id}/correction`, data);
  },
  annulationNote: async (id: string, reason: string, notes: string) => {
    return api.post(`/credit-note/${id}/annulment`, { reason, notes });
  },
};
