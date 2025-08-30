import { z } from "zod";
import { FileSchema } from "./helps";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "A categoria deve ter no mínimo 2 caracteres")
    .max(15, "A categoria deve ter no máximo 100 caracteres"),
  abbreviation: z
    .string()
    .min(2, "A abrevitura deve ter no mínimo 2 caracteres")
    .max(15, "A abrevitura deve ter no máximo 100 caracteres"),

  icon: FileSchema.refine((file) => file, "Arquivo obrigatório").optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
