import { z } from "zod";
import { companySchema } from "./company";


export const registerSchema = z.object({
  step1: z
    .object({
      full_name: z
        .string()
        .nonempty("Campo obrigatorio")
        .min(3, "No minimo 3 caracters"),
      email: z.string().email("Email invalido"),
      phone: z
        .string()
        .max(9, "O número deve ter 9 dígitos")
        .refine(
          (value: string) => /^(92|99|91|95|93|94|97)\d{7}$/.test(value ?? ""),
          "Insira número de telemovél válido"
        ),
      password: z
        .string()
        .nonempty("Campo obrigatório")
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula (A-Z)")
        .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula (a-z)")
        .regex(/[0-9]/, "Deve conter pelo menos um número (0-9)")
        .regex(/[^a-zA-Z0-9]/, "Deve conter pelo menos um caractere especial"),
      passwordConfirmation: z
        .string()
        .nonempty("Campo obrigatorio")
        .min(3, "No minimo 3 caracters"),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "As senhas não coincidem",
      path: ["passwordConfirmation"],
    }),
  step2: z.object({
    company: companySchema,
  }),
  step3: z.object({
    terms: z.literal(true, {
      errorMap: () => ({ message: "Você deve aceitar os termos" }),
    }),
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
