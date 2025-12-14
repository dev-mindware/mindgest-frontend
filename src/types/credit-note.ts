export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number; // unitPrice * quantity
}

export interface InvoiceDetails {
  id: string;
  invoiceNumber: string;
  invoiceType: 'NORMAL_INVOICE' | string; // Permitindo outros tipos se houver
  status: 'CANCELLED' | 'PAID' | 'PENDING' | string; 
  isPaid: boolean;
  clientId: string;
  clientName: string;
  clientEmail: string;
  issueDate: string; // Geralmente ISO date string (YYYY-MM-DD)
  dueDate: string; // Geralmente ISO date string (YYYY-MM-DD)
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number; // subtotal + taxAmount - discountAmount
  notes: string | null;
  createdAt: string; // Data e hora ISO (e.g., "2025-12-13T11:06:03.685Z")
  updatedAt: string; // Data e hora ISO
}

// Alternativamente, você pode usar um type
export type InvoiceType = InvoiceDetails;