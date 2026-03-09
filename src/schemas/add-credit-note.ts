import { z } from "zod";

const BaseCreditNoteSchema = z.object({
  notes: z.string().trim().optional(),
  managerBarcode: z.string().trim().optional(),
});

export const CorrectionSchema = BaseCreditNoteSchema.extend({
  reason: z.literal("CORRECTION"),
  invoiceBody: z.object({
    client: z.object({
      id: z.string().trim().nonempty("Campo obrigatório"),
      name: z.string().trim().optional().or(z.literal("")),
      phone: z.string().trim().optional().or(z.literal("")),
      address: z.string().trim().optional().or(z.literal("")),
      taxNumber: z.string().trim().optional().or(z.literal("")),
    }),
    items: z.array(
      z.object({
        id: z.string().trim().min(1),
        name: z.string().optional(),
        description: z.string().optional(),
        sku: z.string().optional(),
        barcode: z.string().optional(),
        quantity: z.number(),
        price: z.number(),
        cost: z.number().optional(),
        type: z.enum(["PRODUCT", "SERVICE"]).optional(),
        unit: z.string().optional(),
        // Adicione outros campos se necessário, mas os básicos já estão aqui
      }),
    ),
    issueDate: z.string().trim().date(),
    dueDate: z.string().trim().optional(), // opcional para permitir esconder em factura-recibo
    total: z.number(),
    taxAmount: z.number(),
    subtotal: z.number(),
    discountAmount: z.number(),
    notes: z.string().optional(),
  }),
  creditNote: z.object({
    subtotal: z.number(),
    taxAmount: z.number(),
    discountAmount: z.number(),
    total: z.number(),
    items: z.array(
      z.object({
        id: z.string(),
        itemsId: z.string(),
        itemName: z.string(),
        originalPrice: z.number(),
        newPrice: z.number(),
        originalQuantity: z.number(),
        quantity: z.number(),
        originalTotal: z.number(),
        newTotal: z.number(),
        originalTaxAmount: z.number(),
        newTaxAmount: z.number(),
      }),
    ),
  }),
});

export const AnnulmentSchema = BaseCreditNoteSchema.extend({
  reason: z.literal("ANNULMENT"),
  // invoiceBody is allowed but ignored for simple annulment payload
});

export const CreditNoteSchema = z.discriminatedUnion("reason", [
  CorrectionSchema,
  AnnulmentSchema,
]);

export type CreditNoteFormData = z.infer<typeof CreditNoteSchema>;
