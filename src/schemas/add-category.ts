import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "A categoria deve ter no mínimo 2 caracteres")
    .max(50, "A categoria deve ter no máximo 100 caracteres"),
  description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
  storeId: z.string().nonempty("Escolha uma loja").optional(),
  companyId: z.string().nonempty("Escolha uma empresa").optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
