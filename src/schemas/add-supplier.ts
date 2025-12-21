import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  taxNumber: z
    .string()
    .nonempty("Campo obrigatorio")
    .refine(
      (value) => /^\d{9}[A-Z]{2}\d{3}$/.test(value) || /^\d{10}$/.test(value),
      "NIF inválido — use formato de pessoa singular ou coletiva"
    ),
  phone: z
    .string()
    .max(9, "O número deve ter 9 dígitos")
    .refine(
      (value: string) => /^(92|99|91|95|93|94|97)\d{7}$/.test(value ?? ""),
      "Insira número de telemovél válido"
    ),
  email: z.string().email("Email inválido"),
  address: z.string().min(5, "Endereço muito curto"),
  iban: z
    .string()
    .transform((val) => val.replace(/\s+/g, "")) // se quiseres limpar depois
    .optional(),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;
