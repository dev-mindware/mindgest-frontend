import { useModal } from "@/stores/use-modal-store";
import { SupplierResponse } from "@/types";
import { currentSupplierStore } from "@/stores/entities";

export function useSupplierActions() {
  const { openModal } = useModal();
  const { setCurrentSupplier } = currentSupplierStore();

  function handlerEditSupplier(supplier: SupplierResponse) {
    openModal("edit-supplier");
    setCurrentSupplier(supplier);
  }

  function handlerDetailsSupplier(supplier: SupplierResponse) {
    openModal("view-supplier");
    setCurrentSupplier(supplier);
  }

  function handlerDeleteSupplier(supplier: SupplierResponse) {
    openModal("delete-supplier");
    setCurrentSupplier(supplier);
  }

  return {
    handlerDeleteSupplier,
    handlerDetailsSupplier,
    handlerEditSupplier,
  };
}
