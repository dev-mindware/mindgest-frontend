import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;


export const otpSchema = z.object({
  otpCode: z.string().min(6, {
    message: "Seu código de verificação deve ter 6 caracteres.",
  }),
});

export type OtpFormData = z.infer<typeof otpSchema>;
