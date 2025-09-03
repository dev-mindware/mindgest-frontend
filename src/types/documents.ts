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