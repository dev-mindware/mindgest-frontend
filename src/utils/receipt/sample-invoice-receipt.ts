import { AGT_SOFTWARE_CERTIFICATION_NUMBER } from "@/constants/mindprint";
import type { InvoiceReceiptPrintData } from "@/types";

/** Factura fictícia para "Imprimir factura de exemplo" nas definições. */
export const SAMPLE_INVOICE_RECEIPT: InvoiceReceiptPrintData = {
  id: "exemplo",
  title: "FACTURA RECIBO",
  number: "FR EXEMPLO/2026/1",
  issueDate: "2026-11-07T10:30:00",
  accountingPeriod: "2026-11",
  currencyCode: "AOA",
  company: {
    name: "Empresa de Demonstração, Lda",
    taxNumber: "5000000000",
    email: "geral@exemplo.ao",
    phone: "923 000 000",
    address: "Rua da Missão, n.º 10, Ingombota, Luanda",
  },
  client: {
    name: "Consumidor Final",
    taxNumber: "999999999",
  },
  items: [
    {
      description: "Café expresso com açúcar mascavado",
      quantity: 2,
      unitPrice: 725,
      taxLabel: "IVA 14%",
      total: 1450,
    },
    {
      description: "Água mineral 1,5 L",
      quantity: 1,
      unitPrice: 300,
      taxLabel: "Isento M02",
      total: 300,
    },
  ],
  taxes: [
    { label: "IVA 14%", incidence: 1271.93, amount: 178.07 },
    { label: "Isento M02", incidence: 300, amount: 0, note: "M02: Transmissão de bens e serviço não sujeita" },
  ],
  subtotal: 1571.93,
  taxAmount: 178.07,
  total: 1750,
  issuedBy: "Operador de Demonstração",
  notes: "Talão de exemplo: não tem validade fiscal.\nAcentos: ç ã õ é ê º ª",
  paymentTerms: "Pronto pagamento.",
  qrCode: "https://mindgest.mindware.ao/documents/verify/exemplo",
  hash: "EXEM",
  certificationNumber: AGT_SOFTWARE_CERTIFICATION_NUMBER,
  footer: ["Obrigado pela preferência!", "www.mindware.ao"],
};
