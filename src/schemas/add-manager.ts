import { z } from "zod";
import { passwordSchema, phoneNumberSchema } from "./helps";

export const managerSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres"),
  phone: phoneNumberSchema,
  email: z.string().trim().email("Email inválido").optional().or(z.literal("")),
  password: z.string().optional().or(z.literal("")),
  storeIds: z.array(z.string()).min(1, "Deve selecionar pelo menos uma loja"),
});

export type ManagerFormData = z.infer<typeof managerSchema>