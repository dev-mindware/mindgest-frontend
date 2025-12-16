import { ItemData } from "./items";

export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED' | 'OVERDUE';

export type ContactInfo = {
  phone?: string;
  email?: string;
};

export type CompanyInfo = {
  name?: string;
  vatNumber?: string;
  address?: string;
  contact?: ContactInfo;
};

export type InvoiceItem = {
  id: string;
  quantity: number;
  price: string;
  total: string;
  invoiceId: string;
  itemsId: string;
  taxId: string | null;
  item: ItemData;
  tax: any;
};

// ========================
// 💳 PAGAMENTO E PARCELAS
// ========================
export type PaymentMethod = "Cash" | "Card" | "Transfer";
// Estado do pagamento
export type PaymentStatus = "unpaid" | "paid";

// Dados de pagamento (geral)
export type Payment = {
  method: PaymentMethod;
  bankDetails?: string;
  status?: PaymentStatus; // estado do pagamento
  totalPaid?: number; // soma já paga;
};

export type InvoicePayload = {
  issueDate: string;
  dueDate: string;
  client:
    | {
        id: string;
        name?: undefined;
        phone?: undefined;
        address?: undefined;
        vatNumber?: undefined;
      }
    | {
        name: string;
        phone: string | undefined;
        address: string | undefined;
        vatNumber?: string | undefined;
        id?: undefined;
      };
  items: (
    | {
        id: string;
        quantity: number;
        name?: undefined;
        price?: undefined;
        type?: undefined;
      }
    | {
        name: string | undefined;
        price: number;
        quantity: number;
        type: "PRODUCT" | "SERVICE";
        id?: undefined;
      }
  )[];
  total: number;
  taxAmount: number;
  discountAmount: number;
};

export type InvoiceReceiptPayload = {
  issueDate: string;
  client:
    | {
        id: string;
        name?: undefined;
        phone?: undefined;
        address?: undefined;
        email?: undefined;
      }
    | {
        name: string;
        phone: string | undefined;
        address: string | undefined;
        email?: string | undefined;
        id?: undefined;
      };
  items: (
    | {
        id: string;
        quantity: number;
        name?: undefined;
        price?: undefined;
        type?: undefined;
      }
    | {
        name: string | undefined;
        price: number;
        quantity: number;
        type: "PRODUCT" | "SERVICE";
        id?: undefined;
      }
  )[];
  total: number;
  taxAmount: number;
  discountAmount: number;
};

export type ProformaPayload = {
  issueDate: string;
  client:
    | {
        id: string;
        name?: undefined;
        phone?: undefined;
        address?: undefined;
        email?: undefined;
      }
    | {
        name: string;
        phone: string | undefined;
        address: string | undefined;
        email?: string | undefined;
        id?: undefined;
      };
  items: (
    | {
        id: string;
        quantity: number;
        name?: undefined;
        price?: undefined;
        type?: undefined;
      }
    | {
        name: string | undefined;
        price: number;
        quantity: number;
        type: "PRODUCT" | "SERVICE";
        id?: undefined;
      }
  )[];
  total: number;
  taxAmount: number;
  discountAmount: number;
};

// ========================
// 🧾 DOCUMENTOS
// ========================
export type InvoiceData = {
  id: string;
  number: string;
  status: string;
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  receivedValue: string;
  total: string;
  notes?: string;
  dueDate: string;
  paidAt?: string ;
  createdAt: string;
  updatedAt: string;
  paymentMethod: any[];
  type: string;
  isPaid: boolean;
  proformaExpiresAt: string;
  originalInvoiceId: string;
  paymentMethodStr: string;
  companyId: string;
  storeId: string;
  userId: string;
  clientId: string;
  discountId: string;
  items: InvoiceItem[];
};

export type InvoiceFilters = {
  sortBy?: string;
  sortOrder?: string
  status?: InvoiceStatus;
  search?: string;
  invoiceNumber?: string;
  clientName?: string;
  startDate?: string; 
  endDate?: string;   
  storeId?: string;
  minAmount?: number;
  maxAmount?: number;
};


export type InvoiceResponse = InvoiceData & {
  id: string;
  client: {
    name: string;
  };
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreditNoteData = {
  id: string;
  number: string;
  invoiceNumber: string;
  reason: "CORRECTION" | "ANNULATION";
  status: "DRAFT" | "ISSUED" | "CANCELLED";
  total: number; // valor negativo
  taxAmount: number; // idealmente number, não string
  createdAt: string; // ISO Date
};

export interface CreditNoteFilters {
  search?: string;
  reason?: "CORRECTION" | "RETURN" | "DISCOUNT" | "CANCELLATION" | string;
  status?: InvoiceStatus;
  sortBy?: string;
  sortOrder?: string;
  startDate?: string;
  endDate?: string;
}
