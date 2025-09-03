import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  type: z.enum(["emp", "par"], { required_error: "Selecione o tipo de fornecedor" }),
  phone: z.string().regex(/^\d{9}$/, "Telefone deve ter 9 dígitos"),
  email: z.string().email("Email inválido"),
  nif: z.string().regex(/^\d{9}$/, "NIF deve ter 9 dígitos"),
  address: z.string().min(5, "Endereço muito curto"),
  supplyType: z.enum(["src", "prd", "amb"], { required_error: "Selecione o tipo de fornecimento" }),
  deliveryTime: z.string().min(2, "Informe o prazo de entrega"),
  products: z.array(z.string()).min(1, "Adicione pelo menos um produto ou categoria"),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;
