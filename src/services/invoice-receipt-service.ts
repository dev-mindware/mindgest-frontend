import { api } from "./api";
import type { InvoiceReceiptPayload, InvoiceReceiptPrintData } from "@/types";

export const invoiceReceiptService = {
  createInvoiceReceipt: async (data: InvoiceReceiptPayload) => {
    return api.post("/invoice/invoice-receipt", data);
  },

  /**
   * Dados do talão já prontos a imprimir: os mesmos que o backend usa no PDF
   * térmico (hash, QR, certificação, quadro de impostos). Contrato em
   * docs/mindprint-print-data.md.
   */
  getPrintData: async (id: string): Promise<InvoiceReceiptPrintData> => {
    const response = await api.get<
      InvoiceReceiptPrintData | { data: InvoiceReceiptPrintData }
    >(`/invoice/invoice-receipt/${id}/print-data`);
    const body = response.data;
    // Aceita a resposta directa ou embrulhada em { data }.
    return "data" in body && body.data && !("id" in body)
      ? body.data
      : (body as InvoiceReceiptPrintData);
  },
};

