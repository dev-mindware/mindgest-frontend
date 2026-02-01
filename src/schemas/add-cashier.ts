import { z } from "zod";

export const cashierSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  phone: z
    .string()
    .max(9, "O número deve ter 9 dígitos")
    .refine(
      (value: string) => /^(92|99|91|95|93|94|97)\d{7}$/.test(value ?? ""),
      "Insira número de telemovél válido"
    ),
  role: z.enum(["MANAGER", "CASHIER"], {
    required_error: "A função é obrigatória",
  }),
  storeId: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(128, "Senha deve ter no máximo 128 caracteres")
    .refine(
      (password) => /[a-z]/.test(password),
      "Senha deve conter pelo menos uma letra minúscula"
    )
    .refine(
      (password) => /[A-Z]/.test(password),
      "Senha deve conter pelo menos uma letra maiúscula"
    )
    .refine(
      (password) => /\d/.test(password),
      "Senha deve conter pelo menos um número"
    )
    .refine(
      (password) => /[@$!%*?&#_\-+=]/.test(password),
      "Senha deve conter pelo menos um caractere especial"
    )
    .refine((password) => !/\s/.test(password), "Senha não pode conter espaços")
    .optional(),
});

export type CashierFormData = z.infer<typeof cashierSchema>;
