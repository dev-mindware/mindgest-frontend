import { z } from "zod";

export const addProductSchema = z.object({
  selectedCategory: z.string(),
  selectedMeasurement: z.string(),
  stockInitial: z.number(),
  stockMinimum: z.number(),
  warranty: z.number(),
  restockTime: z.number(),
  dailySales: z.number(),
});

export type AddProductFormData = z.infer<typeof addProductSchema>;
