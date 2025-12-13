import { ItemData } from "./items";

export type InvoiceStatus = "Paid" | "Pending" | "Canceled";

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
  customer:
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
  customer:
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
  customer:
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
  discountAmount: string | null;
  total: string;
  notes: string | null;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  paymentMethod: any[];
  type: string;
  isPaid: boolean;
  proformaExpiresAt: string | null;
  originalInvoiceId: string;
  receivedValue: string | null;
  paymentMethodStr: string | null;
  companyId: string;
  storeId: string | null;
  userId: string;
  clientId: string;
  discountId: string | null;
  items: InvoiceItem[];
};

export type InvoiceFilters = {
  sortBy?: string;
  status?: string;
  sortOrder?: string;
  search?: string;
};

export type InvoiceResponse = InvoiceData & {
  id: string;
  client: {
    name: string;
  };
  status: any;
  createdAt: string;
  updatedAt: string;
};

export type ReceiptData = {
  id: string;
  number: string;
  customerId: string;
  total: string;
  paymentMethodStr: string;
  client: {
    name: string;
  };
  originalInvoiceId: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  paymentMethod: PaymentMethod;
};
