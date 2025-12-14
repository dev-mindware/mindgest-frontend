import { useModal } from "@/stores/use-modal-store";
import { ReceiptData } from "@/types";
import { currentReceiptStore } from "@/stores/documents";

export function useReceiptActions() {
  const { openModal } = useModal();
  const { setCurrentReceipt } = currentReceiptStore();

  function handlerDetailsReceipt(receipt: ReceiptData) {
    openModal("details-receipt");
    setCurrentReceipt(receipt);
  }

  return {
    handlerDetailsReceipt,
  };
}
