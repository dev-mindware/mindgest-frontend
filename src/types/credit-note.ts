import { Client } from "./clients";
import { InvoiceStatus } from "./documents";
import { PaymentMethod } from "./receipt";

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


// NOVOS TYPES

export interface CreditNotesResponse {
  id: string
  number: string
  reason: string
  status: string
  notes: string
  userId: string
  createdAt: string
  updatedAt: string
  items: ItemSimple[]
  client: Client
  invoice: Invoice
}

export interface ItemSimple {
  id: string
  quantity: number
  price: string
  total: string
  invoiceId: string
  itemsId: string
  taxId: string
}

export interface Invoice {
  id: string
  number: string
  status: string
  subtotal: string
  taxAmount: string
  retentionAmount: string
  discountAmount: string
  total: string
  notes: string
  paidAt: string
  paymentMethod: PaymentMethod,
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface CreditNoteFilters {
  reason?: "CORRECTION" | "RETURN" | "DISCOUNT" | "CANCELLATION" | string;
  status?: InvoiceStatus;
  creditNoteNumber?: string;
  sortBy?: string;
  sortOrder?: string;
  startDate?: string;
  endDate?: string;
}

// criação de nota de credito

export interface InvoiceBody {
  client: Client
  items: ItemBody[]
  issueDate: string
  dueDate: string
  total: number
  taxAmount: number
  subtotal: number
  discountAmount: number
  notes: string
}

export interface ItemBody {
  id: string
  name: string
  quantity: number
  unitPrice: number
  total: number
}


export type FullItem = ItemSimple & {
  name: string
  description: string
  sku: string
  barcode: string
  cost: number
  type: string
  minStock: number
  maxStock: number
  unit: string
  weight: number
  dimensions: string
  image: string
  hasExpiry: boolean
  expiryDate: string
  daysToExpiry: number
}