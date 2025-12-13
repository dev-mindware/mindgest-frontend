import { api } from "./api";

export type GenerateReceiptPayload = {
  issueDate: string;
  total: number;
  paymentMethod: "CASH" | "CARD" | "TRANSFER";
  originalInvoiceId?: string;
  notes?: string;
};

export const receiptService = {
  generateReceipt: async (invoiceId: string, data: GenerateReceiptPayload) => {
    return api.post(`/invoice/receipt`, {
      ...data,
      originalInvoiceId: invoiceId,
    });
  },
  getReceipts: async () => {
    return api.get("/receipts");
  },
  getReceiptById: async (id: string) => {
    return api.get(`/receipts/${id}`);
  },
};
