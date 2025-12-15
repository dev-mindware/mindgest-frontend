import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceReceiptService } from "@/services/invoice-receipt-service";
import { InvoiceReceiptPayload } from "@/types";

export function useCreateInvoiceReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InvoiceReceiptPayload) => invoiceReceiptService.createInvoiceReceipt(data),
    onSuccess: () => {
      toast.success("Fatura Recibo criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoice-receipt"] });
    },
  });
}

