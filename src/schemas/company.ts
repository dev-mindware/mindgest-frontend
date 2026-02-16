import { z } from "zod";
import { phoneNumberSchema, taxNumberSchema } from "./helps";

export const companySchema = z.object({
  taxNumber: taxNumberSchema,
  name: z
    .string()
    .nonempty("Campo obrigatorio")
    .min(3, "No minimo 3 caracters"),
  address: z.string().nonempty("Campo obrigatorio"),
  phone: phoneNumberSchema,
  email: z.string().email("Email invalido"),
  website: z.string().optional().nullable(),
  logo: z.string().optional(),
});
