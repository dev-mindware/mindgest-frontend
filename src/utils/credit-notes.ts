import { InvoiceDetails, ReceiptDetails } from "@/types/credit-note";
import { CreditNoteFormData } from "@/schemas";
import { isInvoice } from "@/types/credit-notes-guards";

export function mapDocumentToCreditNoteDefaults(
  doc: InvoiceDetails | ReceiptDetails,
): CreditNoteFormData {
  if (isInvoice(doc)) {
    const defaultInvoiceBody = {
      client: {
        id: doc.client?.id || "",
        name: doc.client?.name || "",
        phone: (doc.client as any)?.phone || "",
        address: (doc.client as any)?.address || "",
        taxNumber: (doc.client as any)?.taxNumber || "",
      },
      items: doc.items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.unitPrice,
        type: "PRODUCT" as const, // default
      })),
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: doc.dueDate,
      subtotal: doc.subtotal,
      taxAmount: doc.taxAmount,
      discountAmount: doc.discountAmount,
      total: doc.total ?? doc.totalAmount ?? 0,
      notes: "",
    };

    return {
      reason: "CORRECTION",
      notes: "",
      managerBarcode: "",
      invoiceBody: defaultInvoiceBody,
      creditNote: {
        subtotal: 0,
        taxAmount: 0,
        discountAmount: 0,
        total: 0,
        items: [],
      },
    };
  }

  return {
    reason: "ANNULMENT",
    notes: "",
    managerBarcode: "",
  };
}
