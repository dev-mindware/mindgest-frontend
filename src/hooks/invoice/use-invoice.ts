import { InvoicePayload } from "@/types";
import { invoiceService } from "@/services/invoice-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SucessMessage } from "@/utils/messages";


export function useGenerateReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InvoicePayload> }) =>
      invoiceService.generateReceipt(id, data as any),
    onSuccess: () => {
      SucessMessage("Recibo gerado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useCancelInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invoiceService.cancelInvoice(id),
    onSuccess: () => {
      SucessMessage("Fatura cancelada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}