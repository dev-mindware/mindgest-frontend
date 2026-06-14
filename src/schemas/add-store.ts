import { z } from "zod";
import { phoneNumberSchema } from "./helps";

export const storeSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres"),
  code: z.string().trim().min(1, "Código deve ter pelo menos 1 caractere").max(20, "Código deve ter no máximo 20 caracteres").optional().nullable(),
  email: z.string().trim().email("Email inválido").optional().nullable().or(z.literal("")),
  phone: z.string().trim().optional().nullable(),
  address: z.string().trim().min(5, "Endereço muito curto").optional().nullable().or(z.literal("")),
  status: z.string().trim().optional(),
  manager: z.string().trim().optional(),
  companyId: z.string().trim().optional(),
});

export type StoreFormData = z.infer<typeof storeSchema>;
