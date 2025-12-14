import { z } from "zod";
import { ItemSchema } from "./helps";

export const CompanySchema = z.object({
  name: z
    .string()
    .min(3, "O nome da empresa precisa ter pelo menos 3 caracteres")
    .optional(),
  taxNumber: z
    .string()
    .regex(/^\d{9}$/, "O NIF deve ter 9 dígitos numéricos")
    .optional(),
  address: z
    .string()
    .min(5, "O endereço deve ter pelo menos 5 caracteres")
    .optional(),
  contact: z
    .object({
      phone: z
        .string()
        .regex(/^\d{9,}$/, "O telefone deve ter pelo menos 9 dígitos")
        .optional(),
      email: z.string().email("O email informado não é válido").optional(),
    })
    .optional(),
});

export type CompanyFormData = z.infer<typeof CompanySchema>;

const ClientSchema = z.object({
  name: z
    .string()
    .min(3, "O nome do cliente precisa ter pelo menos 3 caracteres"),
  taxNumber: z.string().optional(),
  address: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres"),
  phone: z.string().optional(),
  email: z.string().email("O email informado não é válido").optional(),
});

/**
 * Pagamento
 */

const PaymentSchema = z.object({
  method: z.enum(["bank_transfer", "cash", "card"], {
    errorMap: () => ({ message: "O método de pagamento é obrigatório" }),
  }),
  bankDetails: z
    .string()
    .min(5, "Os detalhes bancários devem ter pelo menos 5 caracteres")
    .optional(),
});

/**
 * Invoice (Fatura normal)
 */

const InvoiceTotalsSchema = z.object({
  subtotal: z.number().min(0).default(0),
  taxAmount: z.number().min(0).default(0),
  retentionAmount: z.number().min(0).default(0),
  discountAmount: z.number().min(0).default(0),
  total: z.number().min(0).default(0),
});

export const InvoiceSchema = z.object({
  // Campos existentes
  company: CompanySchema.optional(),
  client: ClientSchema,
  // documentNumber: z.string().min(1, "O número da fatura é obrigatório"),
  categoryId: z.union([z.string(), z.number()]).optional(),
  issueDate: z.string().min(1, "A data de emissão é obrigatória"),
  dueDate: z.string().min(1, "A data de vencimento é obrigatória"),
  orderReference: z.string().optional(),
  items: z.array(ItemSchema).min(1, "A fatura deve conter pelo menos 1 item"),
  isPaid: z.boolean(),
  discount: z.number().optional(),
  liquidationDate: z.string().optional(),

  // Campos para cálculos e controle de UI
  clientApiId: z.string().optional(),
  globalTax: z
    .number({ invalid_type_error: "O imposto global deve ser um número" })
    .min(0, "O imposto global não pode ser negativo")
    .max(100, "O imposto global não pode ser maior que 100%")
    .optional()
    .default(0),
  globalRetention: z
    .number({ invalid_type_error: "A retenção global deve ser um número" })
    .min(0, "A retenção global não pode ser negativa")
    .max(100, "A retenção global não pode ser maior que 100%")
    .optional()
    .default(0),
  globalDiscount: z
    .number({ invalid_type_error: "O desconto global deve ser um número" })
    .min(0, "O desconto global não pode ser negativo")
    .max(100, "O desconto global não pode ser maior que 100%")
    .optional()
    .default(0),
  invoiceTotals: InvoiceTotalsSchema.optional().default({
    subtotal: 0,
    taxAmount: 0,
    retentionAmount: 0,
    discountAmount: 0,
    total: 0,
  }),
});

export type InvoiceFormData = z.infer<typeof InvoiceSchema>;

/**
 * Proforma (Fatura Proforma)
 */
export const ProformaSchema = z.object({
  company: CompanySchema.optional(),
  client: ClientSchema,
  categoryId: z.union([z.string(), z.number()]).optional(),
  issueDate: z.string().min(1, "A data de emissão é obrigatória"),
  dueDate: z.string().min(1, "A data de vencimento é obrigatória"),
  orderReference: z.string().optional(),
  items: z.array(ItemSchema).min(1, "A proforma deve conter pelo menos 1 item"),
  discount: z.number().optional(),
});
export type ProformaFormData = z.infer<typeof ProformaSchema>;

/**
 * InvoiceReceipt (Fatura Recibo)
 */

export const InvoiceReceiptSchema = z.object({
  company: CompanySchema.optional(),
  client: ClientSchema,
  // documentNumber: z.string().min(1, "O número da fatura é obrigatório"),
  categoryId: z.union([z.string(), z.number()]).optional(),
  issueDate: z.string().min(1, "A data de emissão é obrigatória"),
  orderReference: z.string().optional(),
  items: z.array(ItemSchema).min(1, "A fatura deve conter pelo menos 1 item"),
  payment: PaymentSchema,
  isPaid: z.boolean(),
  discount: z.number().optional(),
  liquidationDate: z.string().optional(),
});
export type InvoiceReceiptFormData = z.infer<typeof InvoiceReceiptSchema>;

/**
 * Receipt (Recibo gerado de fatura)
 */
export const ReceiptSchema = z.object({
  issueDate: z.string().min(1, "A data de emissão é obrigatória"),
  total: z.number().positive("O total deve ser maior que 0"),
  paymentMethod: z.enum(["CASH", "CARD", "TRANSFER"], {
    errorMap: () => ({ message: "O método de pagamento é obrigatório" }),
  }),
  originalInvoiceId: z.string().optional(),
  notes: z.string().optional(),
});

export type ReceiptFormData = z.infer<typeof ReceiptSchema>;
