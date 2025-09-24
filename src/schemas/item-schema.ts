import { z } from "zod";

export const itemSchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),

  // price = selling price
  price: z
    .number()
    .positive("O preço deve ser maior que 0"),

  // cost = purchase cost
  cost: z
    .number()
    .nonnegative("O custo deve ser maior que 0"),

  minStock: z.number().int().nonnegative().optional(),
  maxStock: z.number().int().nonnegative().optional(),

  unit: z.string().optional(),
  weight: z.number().nonnegative().optional(),
  dimensions: z.string().optional(),
  image: z.string().url("URL inválida").optional(),

  type: z.enum(["SERVICE", "PRODUCT"], {
    required_error: "Tipo obrigatório",
  }),

  companyId: z.string().min(1, "Campo obrigatório"),
  storeId: z.string().min(1, "Campo obrigatório").optional(),
  categoryId: z.string().min(1, "Campo obrigatório"),

  hasExpiry: z.boolean().optional(),
  expiryDate: z.string().datetime().optional(),
  daysToExpiry: z.number().int().positive().optional(),
})
.refine((data) => {
  // Se maxStock existir, deve ser maior que minStock
  if (data.maxStock !== undefined && data.minStock !== undefined) {
    return data.maxStock >= data.minStock;
  }
  return true;
}, {
  message: "O stock máximo deve ser maior ou igual ao stock mínimo",
  path: ["maxStock"],
})
.refine((data) => {
  // Preço de venda (price) deve ser >= custo (cost)
  return data.price >= data.cost;
}, {
  message: "O preço deve ser maior ou igual ao custo",
  path: ["price"],
});

export type ItemFormData = z.infer<typeof itemSchema>;
