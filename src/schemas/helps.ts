import { z } from "zod";

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
    .min(0, "O imposto não pode ser negativo").optional(),
  discount: z
    .number({ invalid_type_error: "O desconto deve ser numérico" })
    .min(0, "O desconto não pode ser negativo").optional(),
  total: z
    .number({ invalid_type_error: "O total deve ser um número" })
    .positive("O total deve ser maior que 0").optional(),
  isFromAPI: z.boolean().optional(),
});

export const taxNumberSchema = z
  .string()
  .nonempty("Campo obrigatorio")
  .refine(
    (value) => /^\d{9}[A-Z]{2}\d{3}$/.test(value) || /^\d{10}$/.test(value),
    "NIF inválido — use formato de pessoa singular ou coletiva"
  );

export const phoneNumberSchema = z
  .string()
  .max(9, "O número deve ter 9 dígitos")
  .refine(
    (value: string) => /^(92|99|91|95|93|94|97)\d{7}$/.test(value ?? ""),
    "Insira número de telemovél válido"
  );
