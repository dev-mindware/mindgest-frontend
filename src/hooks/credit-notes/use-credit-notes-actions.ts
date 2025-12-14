import { useModal } from "@/stores/use-modal-store";
import { InvoiceResponse } from "@/types";
import { currentInvoiceStore } from "@/stores/documents";

export function useCreditNotesActions() {
  const { openModal } = useModal();
  const { setCurrentInvoice } = currentInvoiceStore();
  
  function handlerDetailsInvoice(invoice: InvoiceResponse) {
    openModal("details-credit-notes");
    setCurrentInvoice(invoice);
  }

  return {
    handlerDetailsInvoice,
  };
}
