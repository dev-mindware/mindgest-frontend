import { z } from "zod";

export const itemSchema = z
  .object({
    name: z.string().min(1, "Campo obrigatório"),
    description: z.string().optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),

    price: z.number(),
    cost: z.number().optional(),
    quantity: z.number().optional(),

    minStock: z.number().int().nonnegative().optional(),
    maxStock: z.number().int().nonnegative().optional(),

    unit: z.string().optional(),
    weight: z.number().nonnegative().optional(),
    dimensions: z.string().optional(),
    image: z.string().url("URL inválida").optional(),

    type: z.enum(["SERVICE", "PRODUCT"], {
      required_error: "Tipo obrigatório",
    }),

    companyId: z.string().optional(),
    storeId: z.string().min(1, "Campo obrigatório").optional(),
    categoryId: z.string().min(1, "Campo obrigatório"),

    hasExpiry: z.boolean().optional(),
    expiryDate: z.string().optional(),
    daysToExpiry: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.maxStock !== undefined && data.minStock !== undefined) {
        return data.maxStock >= data.minStock;
      }
      return true;
    },
    {
      message: "O stock máximo deve ser maior ou igual ao stock mínimo",
      path: ["maxStock"],
    },
  )
  .refine(
    (data) => {
      if (data.cost !== undefined && data.price !== undefined) {
        return data.price >= data.cost;
      }
      return true;
    },
    {
      message: "O preço deve ser maior ou igual ao custo",
      path: ["price"],
    },
  );

export type ItemFormData = z.infer<typeof itemSchema>;
