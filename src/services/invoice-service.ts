import { api } from "./api";
import { CreditNoteFormData } from "@/schemas";
import type { DownloadType, InvoicePayload } from "@/types";
import { ReceiptData } from "@/types/receipt";

export const invoiceService = {
  createInvoice: async (data: InvoicePayload) => {
    return api.post("/invoice/normal", data);
  },
  downloadInvoice: async (id: string, type: DownloadType) => {
    if (type === "docx") {
      return api.get(`/invoice/normal/${id}/download-docx`);
    }
    if (type === "pdf") {
      return api.get(`/invoice/normal/${id}/download-pdf`);
    }
    if (type === "xml") {
      return api.get(`/invoice/normal/${id}/download-xml`);
    }
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
