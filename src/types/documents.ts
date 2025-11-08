export type InvoiceStatus = "Paid" | "Pending" | "Canceled";

export interface Invoice {
  id: string;
  client: string;
  total: number;
  status: InvoiceStatus;
  date: string;
}

export interface Proforma {
  id: string;
  client: string;
  estimate: number;
  validUntil: string;
  status: "Draft" | "Confirmed";
}

export interface Receipt {
  id: string;
  client: string;
  amount: number;
  date: string;
  method: "Cash" | "Card" | "Transfer";
}

// RECEIP 
// Tipos base reutilizáveis


// ========================
// 🏢 ENTIDADES BASE
// ========================
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

export type CustomerInfo = {
  name: string;
  address: string;
  vatNumber?: string;
};

// ========================
// 💰 ITENS E TOTAIS
// ========================
export type Item = {
  description?: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
};

export type Totals = {
  subtotal?: number;
  totalTax?: number;
  totalDue: number;
};

// ========================
// 💳 PAGAMENTO E PARCELAS
// ========================
export type PaymentMethod = "bank_transfer" | "cash" | "card";

// Estado do pagamento
export type PaymentStatus = "unpaid" | "partial" | "paid";

// Uma parcela de pagamento
export type Installment = {
  amount: number;          // valor pago nesta parcela
  date: string;            // data do pagamento
  method: PaymentMethod;   // forma de pagamento
  reference?: string;      // id ou referência bancária
};

// Dados de pagamento (geral)
export type Payment = {
  method: PaymentMethod;
  bankDetails?: string;
  status?: PaymentStatus;      // estado do pagamento
  installments?: Installment[]; // lista de parcelas
  totalPaid?: number;           // soma já paga
};

// ========================
// 🧾 DOCUMENTOS
// ========================

// Recibo (pós-pagamento) RECIBO DO POS
export type ReceiptFormData = {
  documentNumber: string;
  issueDate: string;
  paymentDate?: string;
  totals: Pick<Totals, "totalDue">;
  referenceInvoice: string;
  company?: CompanyInfo;
  customer?: CustomerInfo;
  items?: Omit<Item, "total">[]; // itens opcionais, sem total detalhado
  payment?: Payment;
};

// Pró-forma (orçamento / proposta)
export type ProformaFormData = {
  documentNumber: string;
  issueDate: string;
  customer: CustomerInfo;
  items: Item[];
  totals: Required<Totals>;
  company?: CompanyInfo;
  payment?: Payment;
}; // good

// Fatura Recibo
export type ReceiptInvoice = {
  documentNumber: string;
  issueDate: string;
  dueDate: string;
  customer: CustomerInfo;
  items: Item[];
  totals: Required<Totals>;
  payment: Payment;
  company?: CompanyInfo;
  categoryId?: string;
  orderReference?: string;
  discount?: number;
  isPaid: boolean; // por default é true
  paymentDate?: string;  // data do pagamento total
};

// fatura

// recibo
export type ReceiptData = {
  receiptNumber: string;        // Nº Recibo (ex: RC 2025/0001)
  costumerName: string
  issueDate: string;            // Data de criação (ex: 8/11/2025)
  invoiceValue: number;         // Valor total da fatura
  discounts?: number;            // Valor descontado
  receivedValue: number;        // Valor efetivamente recebido
  taxes?: number;                // Impostos (se houver)
  operator: string;             // Nome do operador responsável
  referenceInvoice: string;    // Referência da fatura
  paymentMethod?: string;       // Método de pagamento (ex: “Transferência”, “Cash”)
  notes?: string;               // Observações adicionais
};
