import { useModal } from "@/stores/use-modal-store";
import { currentProductStore } from "@/stores";
import { Product } from "@/types";

export function useProductActions() {
  const { openModal } = useModal();
  const { setCurrentProduct } = currentProductStore();

  function handlerEditProduct(product: Product) {
    openModal("edit-product");
    setCurrentProduct(product);
  }

  function handlerDetailsProduct(product: Product) {
    openModal("view-product");
    setCurrentProduct(product);
  }

  function handlerDeleteProduct(product: Product) {
    openModal("delete-product");
    setCurrentProduct(product);
  }

  return {
    handlerDeleteProduct,
    handlerDetailsProduct,
    handlerEditProduct,
  };
}
