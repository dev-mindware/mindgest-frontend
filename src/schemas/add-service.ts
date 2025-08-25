import { z } from "zod";

export const addServiceSchema = z.object({
  name: z.string().nonempty("Campo obrigatório"),
  selectedCategory: z.string().nonempty("Campo obrigatório"),
  price: z.coerce.number().min(0, "Preço deve ser maior ou igual a 0"),
  selectedStatus: z.enum(["Activo", "Inactivo", "Pendente"], {
    required_error: "Campo obrigatório",
  }),
  description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
});

export type AddServiceFormData = z.infer<typeof addServiceSchema>;
