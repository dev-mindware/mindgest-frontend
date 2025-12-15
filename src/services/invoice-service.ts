import { api } from "./api";
import { CreditNoteFormData } from "@/schemas";
import type { InvoicePayload } from "@/types";
import { ReceiptData } from "@/types/receipt";

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
  createCreditNote: async (id: string, data: CreditNoteFormData) => {
    return api.post(`/credit-note/${id}/correction`, data);
  },
  annulationNote: async (id: string, reason: string, notes: string) => {
    return api.post(`/credit-note/${id}/annulment`, { reason, notes });
  },
};
