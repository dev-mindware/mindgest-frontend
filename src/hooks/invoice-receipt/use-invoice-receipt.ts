import { InvoiceData } from "@/types";
import { invoiceReceiptService } from "@/services/invoice-receipt-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SucessMessage } from "@/utils/messages";



export function viewInvoice(invoice: InvoiceData) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invoiceReceiptService.getInvoiceReceipt(id),
    onSuccess: () => {
      SucessMessage("Fatura visualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}