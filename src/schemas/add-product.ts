import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string().nonempty("Campo obrigatório"),
  selectedCategory: z.string().nonempty("Campo obrigatório"),
  sku: z.string().nonempty("Campo obrigatório"),
  price: z.coerce.number().min(0, "Preço deve ser maior ou igual a 0"),

  selectedMeasurement: z.string().optional(),

  stock: z.number().min(0, "Estoque inicial deve ser maior ou igual a 0"),
  minStock: z.number().min(0, "Estoque mínimo deve ser maior ou igual a 0").nullable().optional(),
  tax: z.number().min(0, "Imposto deve ser maior ou igual a 0").nullable().optional(),
  warranty: z.number().nullable().optional(),
  repositionTime: z.number().min(0, "Tempo de reposição deve ser maior ou igual a 0").nullable().optional(),
  salesPerDay: z.number().min(0, "Vendas por dia deve ser maior ou igual a 0").nullable().optional(),

  supplier: z.string().optional(),
  location: z.string().optional(),

  expiryDate: z.coerce.date().nullable().optional(),

  selectedStatus: z.enum(["Disponível", "Esgotado", "Pendente"]),

  description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
});

export type AddProductFormData = z.infer<typeof addProductSchema>;
