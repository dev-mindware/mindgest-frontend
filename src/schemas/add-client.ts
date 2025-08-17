import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  nif: z
    .string()
    .regex(/^\d{9}$/, "NIF deve ter exatamente 9 dígitos"),
  typeCompany: z.string().nonempty("Selecione o tipo de empresa"),
  phone: z
    .string()
    .regex(/^\d{9}$/, "Telefone deve ter 9 dígitos"),
  email: z.string().email("Email inválido"),
  address: z.string().min(5, "Endereço muito curto"),
  iban: z
    .string()
    .regex(
      /^AO\d{23}$/,
      "IBAN inválido (deve começar com 'AO' e ter 25 caracteres)"
    ),
  category: z.string().nonempty("Selecione uma categoria"),
  registerDate: z.string().nonempty("Selecione uma data válida"),
});

export type ClientFormData = z.infer<typeof clientSchema>;
