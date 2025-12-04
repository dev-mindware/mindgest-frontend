import { api } from "./api";
import type { InvoiceReceiptPayload } from "@/types";

export const invoiceReceiptService = {
  createInvoiceReceipt: async (data: InvoiceReceiptPayload) => {
    return api.post("/invoice/invoice-receipt", data);
  },
  getInvoiceReceipt: async (id: string) => {
    return api.get(`/invoice/invoice-receipt/${id}`);
  },
};

