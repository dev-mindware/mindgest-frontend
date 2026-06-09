import { z } from "zod";
import { phoneNumberSchema } from "./helps";

export const cashierSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres"),
  phone: phoneNumberSchema,
  role: z.enum(["CASHIER"], {
    required_error: "A função é obrigatória",
  }),
  storeId: z.string().trim().optional(),
  email: z.string().trim().email("Email inválido").optional().or(z.literal("")),
  password: z.string().optional().or(z.literal("")),
});

export type CashierFormData = z.infer<typeof cashierSchema>;
