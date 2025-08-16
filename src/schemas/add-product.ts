import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string().nonempty("Campo obrigatório"),
  selectedCategory: z.string().nonempty("Campo obrigatório"),

  selectedMeasurement: z.string().optional(),
  supplier: z.string().optional(),
  location: z.string().optional(),

  price: z.coerce.number().min(0, "Preço deve ser maior ou igual a 0").optional().nullable(),
  initialStock: z.coerce.number().min(0, "Estoque inicial deve ser maior ou igual a 0").optional().nullable(),
  minStock: z.coerce.number().min(0, "Estoque mínimo deve ser maior ou igual a 0").optional().nullable(),

  expiryDate: z.string().datetime().optional().nullable(),
  tax: z.coerce.number().min(0, "Imposto deve ser maior ou igual a 0").optional().nullable(),
  warranty: z.coerce.number().optional().nullable(),
  repositionTime: z.coerce.number().min(0, "Tempo de reposição deve ser maior ou igual a 0").optional().nullable(),
  salesPerDay: z.coerce.number().min(0, "Vendas por dia deve ser maior ou igual a 0").optional().nullable(),

  description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional()
});

export type AddProductFormData = z.infer<typeof addProductSchema>;
