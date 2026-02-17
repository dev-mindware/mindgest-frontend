import { z } from "zod";

export const bankSchema = z.object({
  bankName: z
    .string()
    .trim()
    .min(3, "O nome do banco deve ter pelo menos 3 caracteres"),
  accountNumber: z.string().trim().min(5, "Número da conta inválido"),
  iban: z.string().trim().min(15, "IBAN inválido").max(34, "IBAN inválido"),
  phone: z.string().trim().optional().or(z.literal("")),
  isDefault: z.boolean().default(false).optional(),
});

export type BankFormData = z.infer<typeof bankSchema>;
