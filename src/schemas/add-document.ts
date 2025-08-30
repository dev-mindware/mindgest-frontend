import { z } from "zod";

const CompanySchema = z.object({
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
    .regex(/^\d{9}$/, "O NIF deve ter 9 dígitos numéricos")
    .optional(),
  address: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres"),
});

const ItemSchema = z.object({
  description: z.string().optional(),
  quantity: z
    .number({ invalid_type_error: "A quantidade deve ser um número" })
    .positive("A quantidade deve ser maior que 0"),
  unitPrice: z
    .number({ invalid_type_error: "O preço unitário deve ser um número" })
    .positive("O preço unitário deve ser maior que 0"),
  tax: z
    .number({ invalid_type_error: "O imposto deve ser numérico" })
    .min(0, "O imposto não pode ser negativo"),
  total: z
    .number({ invalid_type_error: "O total deve ser um número" })
    .positive("O total deve ser maior que 0"),
});

/**
 * Totais
 */
const TotalsSchema = z.object({
  subtotal: z.number().min(0, "O subtotal não pode ser negativo"),
  totalTax: z.number().min(0, "O total de impostos não pode ser negativo"),
  totalDue: z.number().min(0, "O valor total a pagar não pode ser negativo"),
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
export const InvoiceSchema = z.object({
  company: CompanySchema.optional(),
  customer: CustomerSchema,
  documentNumber: z.string().min(1, "O número da fatura é obrigatório"),
  issueDate: z.string().min(1, "A data de emissão é obrigatória"),
  dueDate: z.string().min(1, "A data de vencimento é obrigatória"),
  orderReference: z.string().optional(),
  items: z.array(ItemSchema).min(1, "A fatura deve conter pelo menos 1 item"),
  totals: TotalsSchema,
  payment: PaymentSchema,
});
export type InvoiceFormData = z.infer<typeof InvoiceSchema>;

/**
 * Proforma
 */
export const ProformaSchema = z.object({
  company: CompanySchema.optional(),
  customer: CustomerSchema,
  documentNumber: z.string().min(1, "O número da proforma é obrigatório"),
  issueDate: z.string().min(1, "A data de emissão é obrigatória"),
  items: z.array(ItemSchema).min(1, "A proforma deve conter pelo menos 1 item"),
  totals: TotalsSchema,
  payment: PaymentSchema.optional(),
});
export type ProformaFormData = z.infer<typeof ProformaSchema>;

/**
 * Receipt (Recibo)
 */
export const ReceiptSchema = z.object({
  company: CompanySchema.optional(),
  customer: CustomerSchema.optional(),
  documentNumber: z.string().min(1, "O número do recibo é obrigatório"),
  issueDate: z.string().min(1, "A data de emissão é obrigatória"),
  referenceInvoice: z.string().min(1, "A referência da fatura é obrigatória"),
  items: z.array(ItemSchema).optional(), 
  totals: TotalsSchema.pick({ totalDue: true }),
  payment: PaymentSchema.optional(),
});
export type ReceiptFormData = z.infer<typeof ReceiptSchema>;
