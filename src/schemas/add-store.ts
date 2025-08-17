import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .regex(/^\d{9}$/, "Telefone deve ter 9 dígitos"),
  address: z.string().min(5, "Endereço muito curto"),
  status: z.enum(["act", "des", "sus"], {
    required_error: "Selecione o status",
  }),
  manager: z.string().nonempty("Selecione um gerente"),
});

export type StoreFormData = z.infer<typeof storeSchema>;
