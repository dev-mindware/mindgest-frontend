import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  phone: z
    .string()
    .max(9, "O número deve ter 9 dígitos")
    .refine(
      (value: string) => /^(92|99|91|95|93|94|97)\d{7}$/.test(value ?? ""),
      "Insira número de telemovél válido"
    ),
  email: z.string().email("Email inválido"),
  address: z.string().min(5, "Endereço muito curto"),
});

export type StoreFormData = z.infer<typeof storeSchema>;
