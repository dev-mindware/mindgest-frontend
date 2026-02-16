import { z } from "zod";
import { phoneNumberSchema, taxNumberSchema } from "./helps";

export const clientSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  taxNumber: taxNumberSchema,
  phone: phoneNumberSchema,
  email: z.string().email("Email inválido"),
  address: z.string().optional(),
  iban: z
    .string()
    .transform((val) => val.replace(/\s+/g, "")) 
    .optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
