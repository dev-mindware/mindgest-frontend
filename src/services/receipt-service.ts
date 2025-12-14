import { api } from "./api";

export type GenerateReceiptPayload = {
  issueDate: string;
  total: number;
  paymentMethod: "CASH" | "CARD" | "TRANSFER";
  originalInvoiceId?: string;
  notes?: string;
};

export const receiptService = {
  generateReceipt: async (data: GenerateReceiptPayload) => {
    return api.post(`/invoice/${data.originalInvoiceId}/receipt`, data);
  },
  getReceipts: async () => {
    return api.get("/receipts");
  },
  getReceiptById: async (id: string) => {
    return api.get(`/receipts/${id}`);
  },
};
