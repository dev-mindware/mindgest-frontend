import { z } from "zod";

export const companySchema = z.object({
  taxNumber: z
    .string()
    .nonempty("Campo obrigatorio")
    .refine(
      (value) => /^\d{9}[A-Z]{2}\d{3}$/.test(value) || /^\d{10}$/.test(value),
      "NIF inválido — use formato de pessoa singular ou coletiva"
    ),
  name: z
    .string()
    .nonempty("Campo obrigatorio")
    .min(3, "No minimo 3 caracters"),
  address: z
    .string()
    .nonempty("Campo obrigatorio")
    .min(3, "No minimo 3 caracters"),
  phone: z
    .string()
    .max(9, "O número deve ter 9 dígitos")
    .refine(
      (value: string) => /^(92|99|91|95|93|94|97)\d{7}$/.test(value ?? ""),
      "Insira número de telemovél válido"
    ),
  email: z.string().email("Email invalido"),
  website: z
    .string()
    .nonempty("Campo obrigatorio")
    .min(3, "No minimo 3 caracters"),
  logo: z.string().optional(),
});
