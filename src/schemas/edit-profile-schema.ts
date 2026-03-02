import { z } from "zod";
import { FileSchema, phoneNumberSchema, taxNumberSchema } from "./helps";

export const editProfileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  phone: phoneNumberSchema.optional(),
  email: z.string().trim().email("Email invalido").optional(),
  companyLogo: FileSchema.optional(),
  taxNumber: taxNumberSchema.optional(),
  companyName: z.string().min(3, "Nome da empresa é obrigatório").optional(),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
