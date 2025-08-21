import { Button, GlobalModal } from "@/components";
import { currentProductStore } from "@/stores";
import { useModal } from "@/stores/use-modal-store";

export function DeleteService() {
  const { closeModal } = useModal();
  const { currentProduct } = currentProductStore();

  return (
    <GlobalModal
      id="delete-product"
      title="Tem certeza que deseja apagar o produto?"
      description="Lembre-se que esta ação não pode ser desfeita."
      warning
      canClose
      footer={
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => closeModal("delete-product")}
            variant="outline"
          >
            Fechar
          </Button>
        </div>
      }
    >
      <pre>{JSON.stringify(currentProduct, null, 2)}</pre>
    </GlobalModal>
  );
}
