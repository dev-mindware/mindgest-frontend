
import { z } from "zod"

export const FileSchema = z.object({
  size: z.number(),
  type: z.string(),
  filename: z.string(),
  url: z.string().url(),
});

export const ItemSchema = z.object({
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
})