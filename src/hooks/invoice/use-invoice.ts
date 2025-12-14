import { toast } from "sonner";
import { invoiceService, ReceiptData } from "@/services/invoice-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditNoteFormData } from "@/schemas";

export function useGenerateReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReceiptData) => invoiceService.generateReceipt(data),
    onSuccess: () => {
      toast.success("Recibo gerado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoice-receipt"] });
    },
  });
}

export function useCancelInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invoiceService.cancelInvoice(id),
    onSuccess: () => {
      toast.success("Fatura cancelada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoice-normal"] });
    },
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => invoiceService.createInvoice(data),
    onSuccess: () => {
      toast.success("Fatura criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoice-normal"] });
    },
  });
}

export function useGetInvoice(id: string | undefined) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoiceService.getInvoice(id!),
    enabled: !!id,
  });
}

export function useCreateCreditNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreditNoteFormData }) =>
      invoiceService.createCreditNote(id, data),
    onSuccess: () => {
      toast.success("Nota de crédito criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoice-normal"] });
    },
  });
}

export function useAnnulationNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      reason,
      notes,
    }: {
      id: string;
      reason: string;
      notes: string;
    }) => invoiceService.annulationNote(id, reason, notes),
    onSuccess: () => {
      toast.success("Nota de Anulada criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoice-normal"] });
    },
  });
}
