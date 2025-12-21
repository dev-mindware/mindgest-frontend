import { toast } from "sonner";
import { invoiceService } from "@/services/invoice-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditNoteFormData } from "@/schemas";
import { ReceiptData } from "@/types/receipt";
import { DownloadType } from "@/types";

export function useGenerateReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReceiptData) => invoiceService.generateReceipt(data),
    onSuccess: () => {
      toast.success("Recibo gerado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoice-receipt"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-normal"] });
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

export function useDownloadInvoice() {
  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: DownloadType }) =>
      invoiceService.downloadInvoice(id, type),
    onSuccess: () => {
      toast.success("Documento baixado com sucesso!");
    },
  });
}
