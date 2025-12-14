import { z } from "zod";

export const CreditNoteSchema = z.object({
  reason: z.enum(["CORRECTION", "ANNULATION"]),

  invoiceBody: z.object({
    client: z.object({
      id: z.string().nonempty("Campo obrigatório"),
      name: z.string().nonempty("Campo obrigatório"),
      email: z.string().email(),
    }),

    items: z
      .array(
        z.object({
          id: z.string().min(1),
          quantity: z.number(),
          price: z.number(),
        })
      )
      .optional(),

    issueDate: z.string().date(),
    dueDate: z.string().date(),

    total: z.number(),
    taxAmount: z.number(),
    subtotal: z.number(),
    discountAmount: z.number(),
  }),

  notes: z.string().optional(),
});

export type CreditNoteFormData = z.infer<typeof CreditNoteSchema>;
