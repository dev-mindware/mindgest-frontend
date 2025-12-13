import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { receiptService } from "@/services/receipt-service";
import { ReceiptFormData } from "@/schemas";

type Data = {
  data: ReceiptFormData;
  originalInvoiceId: string;
}

export function useGenerateReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, originalInvoiceId } :Data) =>  receiptService.generateReceipt(originalInvoiceId, data),
    onSuccess: () => {
      toast.success("Recibo gerado com sucesso!");
       queryClient.invalidateQueries({ queryKey: ["invoice-normal"] });
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}