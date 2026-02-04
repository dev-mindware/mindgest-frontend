import { z } from "zod";

export const posOpeningSchema = z.object({
  initialCapital: z.string().min(1, "Capital inicial é obrigatório"),
  workTime: z.string().min(1, "Tempo de expediente é obrigatório"),
  storeId: z.string().min(1, "Loja é obrigatória"),
  cashierIds: z.array(z.string()).min(1, "Selecione pelo menos um caixa"),
  fundType: z.string().optional(),
});

export const posOpeningCashierSchema = z.object({
  initialCapital: z.string().min(1, "Capital inicial é obrigatório"),
  workTime: z.string().min(1, "Tempo de expediente é obrigatório"),
  storeId: z.string().min(1, "Loja é obrigatória"),
  // cashierId is usually injected from context, but we validate if needed
  cashierId: z.string().optional(),
  fundType: z.string().optional(),
  managerBarcode: z.string().min(1, "Código do gerente é obrigatório"),
});

export type PosOpeningFormData = z.infer<typeof posOpeningSchema>;
export type PosOpeningCashierFormData = z.infer<typeof posOpeningCashierSchema>;
