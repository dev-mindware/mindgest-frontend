import { z } from "zod";

export const registerSchema = z.object({
  step1: z.object({
    nif: z
      .string()
      .nonempty("Campo é obrigatório")
      .min(3, "Mínimo 3 caracteres"),
    name: z
      .string()
      .nonempty("Campo é obrigatório")
      .min(10, "Mínimo 10 caracteres"),
    company: z
      .string()
      .nonempty("Campo é obrigatório")
      .min(1, "Minimo 3 caracteres"),
    phone: z
      .string()
      .nonempty("Campo é obrigatório")
      .min(9, "Mínimo 9 caracteres"),
    email: z
      .string()
      .email("Email inválido")
      .nonempty("Campo é obrigatório")
      .min(3, "Mínimo 3 caracteres"),
  }),

  step2: z.object({
    businessType: z.string().nonempty("Campo é obrigatório"),
  }),

  step3: z.object({
    services: z
      .array(
        z.object({
          val: z.string().min(1, "Serviço inválido"),
        })
      )
      .min(1, "Adicione pelo menos um serviço"),
  }),

  step4: z.object({
    terms: z.literal(true, {
      errorMap: () => ({ message: "Você deve aceitar os termos" }),
    }),
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
