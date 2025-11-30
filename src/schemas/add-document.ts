import { z } from "zod";

export const CompanySchema = z.object({
  name: z
    .string()
    .min(3, "O nome da empresa precisa ter pelo menos 3 caracteres")
    .optional(),
  vatNumber: z
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

const CustomerSchema = z.object({
  name: z
    .string()
    .min(3, "O nome do cliente precisa ter pelo menos 3 caracteres"),
  vatNumber: z
    .string()
    .optional(),
  address: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres"),
  phone: z.string().optional(),
});

const ItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["PRODUCT", "SERVICE"]),
  quantity: z
    .number({ invalid_type_error: "A quantidade deve ser um número" })
    .positive("A quantidade deve ser maior que 0"),
  unitPrice: z
    .number({ invalid_type_error: "O preço unitário deve ser um número" })
    .positive("O preço unitário deve ser maior que 0"),
  tax: z
    .number({ invalid_type_error: "O imposto deve ser numérico" })
    .min(0, "O imposto não pode ser negativo"),
  discount: z
    .number({ invalid_type_error: "O desconto deve ser numérico" })
    .min(0, "O desconto não pode ser negativo"),
  total: z
    .number({ invalid_type_error: "O total deve ser um número" })
    .positive("O total deve ser maior que 0"),
  isFromAPI: z.boolean().optional(),
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

export const ReceiptInvoiceSchema = z.object({
  company: CompanySchema.optional(),
  customer: CustomerSchema,
  // documentNumber: z.string().min(1, "O número da fatura é obrigatório"),
  categoryId: z.union([z.string(), z.number()]).optional(),
  issueDate: z.string().min(1, "A data de emissão é obrigatória"),
  dueDate: z.string().min(1, "A data de vencimento é obrigatória"),
  orderReference: z.string().optional(),
  items: z.array(ItemSchema).min(1, "A fatura deve conter pelo menos 1 item"),
  payment: PaymentSchema,
  isPaid: z.boolean(),
  discount: z.number().optional(),
  liquidationDate: z.string().optional(),
});
export type ReceiptInvoiceFormData = z.infer<typeof ReceiptInvoiceSchema>;

/**
 * Proforma
 */
export const ProformaSchema = z.object({
  company: CompanySchema.optional(),
  customer: CustomerSchema,
  // documentNumber: z.string().min(1, "O número da proforma é obrigatório"),
  issueDate: z.string().min(1, "A data de emissão é obrigatória"),
  items: z.array(ItemSchema).min(1, "A proforma deve conter pelo menos 1 item"),
  payment: PaymentSchema.optional(),
});
export type ProformaFormData = z.infer<typeof ProformaSchema>;

export type CompanyFormData = z.infer<typeof CompanySchema>;
// ==============================
// 💵 Recibo - Estrutura Completa
// ==============================

export const InvoiceSchema = z.object({
  company: CompanySchema.optional(),
  customer: CustomerSchema,
  issueDate: z.string().min(1, "A data de emissão é obrigatória"),
  dueDate: z.string().min(1, "A data de vencimento é obrigatória"),
  items: z.array(ItemSchema).min(1, "A fatura deve conter pelo menos 1 item"),
  discount: z.number().optional(),
});
export type InvoiceFormData = z.infer<typeof InvoiceSchema>;

export const ReceiptSchema = z.object({
  issueDate: z.string().min(1, "A data de emissão é obrigatória"),
  total: z.number().min(1, "O total é obrigatório"),
  taxAmount: z.number().min(1, "O imposto é obrigatório"),
  discountAmount: z.number().min(1, "O desconto é obrigatório"),
  paymentMethod: PaymentSchema,
});

export type ReceiptFormData = z.infer<typeof ReceiptSchema>;