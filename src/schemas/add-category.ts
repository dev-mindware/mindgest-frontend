// src/schemas/category.ts
import { z } from "zod";
import { FileSchema } from "./helps";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "A categoria deve ter no mínimo 2 caracteres")
    .max(50, "A categoria deve ter no máximo 100 caracteres"),

  abbreviation: z
    .string()
    .min(2, "A abreviatura deve ter no mínimo 2 caracteres")
    .max(15, "A abreviatura deve ter no máximo 15 caracteres")
    .regex(/^[A-Z]+$/, "A abreviatura deve conter apenas letras maiúsculas sem espaços"),

  description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
