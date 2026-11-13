// ========================
// 🖨️ MINDPRINT (agente local de impressão)
// ========================

export type MindPrintErrorCode =
  | "ORIGIN_NOT_ALLOWED"
  | "HOST_NOT_ALLOWED"
  | "NOT_PAIRED"
  | "INVALID_TOKEN"
  | "NO_PAIRING_CODE"
  | "INVALID_CODE"
  | "CODE_EXPIRED"
  | "RATE_LIMITED"
  | "INVALID_REQUEST"
  | "INVALID_DATA"
  | "PAYLOAD_TOO_LARGE"
  | "INVALID_PRINTER"
  | "PRINTER_NOT_FOUND"
  | "NO_DEFAULT_PRINTER"
  | "PRINTER_NOT_ALLOWED"
  | "PRINTER_UNREACHABLE"
  | "PRINTER_TYPE_UNSUPPORTED"
  | "JOB_IN_PROGRESS"
  | "PRINT_FAILED"
  | "PRINTER_LIST_FAILED"
  /** Código próprio do MindGest: o agente não respondeu (não instalado, parado ou acesso à rede local recusado). */
  | "AGENT_UNAVAILABLE"
  /** Código próprio do MindGest: resposta inesperada do agente. */
  | "UNKNOWN";

export type MindPrintHealth = {
  status: "ok";
  version: string;
  paired: boolean;
};

export type MindPrintPrinter = {
  id: string;
  name: string;
  type: "windows" | "tcp";
  default: boolean;
};

export type MindPrintJobStatus = "spooled" | "sent";

export type MindPrintPrintResult = {
  jobId: string;
  printer: string;
  status: MindPrintJobStatus;
  duplicate: boolean;
};

export type MindPrintTestResult = {
  printer: string;
  status: MindPrintJobStatus;
};

export type PrinterAgentStatus = "checking" | "unavailable" | "unpaired" | "ready";

export type PaperWidth = "80mm" | "58mm";

// ========================
// 🧾 Dados do talão da Factura Recibo (vêm do backend, prontos a imprimir)
// ========================

type Amount = number | string;

export type InvoiceReceiptPrintItem = {
  description: string;
  quantity: Amount;
  unitPrice: Amount;
  /** Etiqueta da taxa tal como no documento legal (ex.: "IVA 14%", "Isento M02"). */
  taxLabel: string;
  total: Amount;
};

export type InvoiceReceiptPrintTax = {
  /** Imposto/Taxa (ex.: "IVA 14%"). */
  label: string;
  incidence: Amount;
  amount: Amount;
  /** Texto legal a imprimir por baixo (ex.: motivo de isenção "M04: Regime de Exclusão"). */
  note?: string | null;
};

export type InvoiceReceiptPrintData = {
  id: string;
  /** Título do documento (ex.: "FACTURA RECIBO"). */
  title: string;
  number: string;
  /** Data de emissão, ISO 8601. */
  issueDate: string;
  /** Período contabilístico já formatado (ex.: "2026-11"). */
  accountingPeriod: string;
  currencyCode?: string;
  company: {
    name: string;
    taxNumber: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    logoUrl?: string | null;
  };
  client: {
    name: string;
    taxNumber?: string | null;
  };
  items: InvoiceReceiptPrintItem[];
  taxes: InvoiceReceiptPrintTax[];
  subtotal: Amount;
  taxAmount: Amount;
  discountAmount?: Amount | null;
  retentionAmount?: Amount | null;
  total: Amount;
  issuedBy?: string | null;
  notes?: string | null;
  paymentTerms?: string | null;
  /** Conteúdo exacto do código QR (o mesmo do PDF). */
  qrCode: string;
  /** Hash tal como sai no documento legal (ex.: "aB3x"). */
  hash: string;
  /** N.º de certificação do programa (ex.: "FE/241/AGT/2026"). */
  certificationNumber: string;
  /** Linhas do rodapé (contactos). */
  footer?: string[];
};
