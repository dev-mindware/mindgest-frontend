import { Button, GlobalModal } from "@/components";
import { currentProductStore } from "@/stores";
import { useModal } from "@/stores/use-modal-store";

export function DeleteProductModal() {
  const { closeModal } = useModal();
  const { currentProduct } = currentProductStore();

  return (
    <GlobalModal
      warning
      canClose
      className="!w-max"
      id="delete-product"
      title="Tem certeza que deseja apagar o produto?"
      description="Lembre-se que esta ação não pode ser desfeita."
    >
      <h1 className="text-center">{currentProduct?.name}</h1>
      <div className="flex justify-end gap-4">
        <Button onClick={() => closeModal("delete-product")} variant="outline">
          Fechar
        </Button>
        <Button
          onClick={() => closeModal("delete-product")}
          variant="destructive"
        >
          Apagar
        </Button>
      </div>
    </GlobalModal>
  );
}
