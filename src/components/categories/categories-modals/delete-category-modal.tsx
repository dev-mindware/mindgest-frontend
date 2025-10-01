import { useDeleteItem } from "@/hooks";
import { Button, GlobalModal } from "@/components";
import { currentProductStore } from "@/stores";
import { useModal } from "@/stores/use-modal-store";
import { ErrorMessage } from "@/utils/messages";

export function DeleteProductModal() {
  const { closeModal } = useModal();
  const { currentProduct } = currentProductStore();
  const { mutateAsync: deleteItemMutate, isPending } = useDeleteItem();

  async function handleDelete(id: string) {
    if (!currentProduct) return;
    try {
      await deleteItemMutate(id);
      closeModal("delete-product");
    } catch (error: any) {
      if (error?.response) {
        ErrorMessage(
          error.response.data.message || "Erro ao apagar o produto."
        );
      } else {
        ErrorMessage("Ocorreu um erro desconhecido. Tente novamente.");
      }
    }
  }

  return (
    <GlobalModal
      warning
      canClose
      className="!w-max"
      id="delete-category"
      title="Tem certeza que deseja apagar a categoria?"
      description="Lembre-se que esta ação não pode ser desfeita."
    >
      <div className="flex justify-end gap-4">
        <Button onClick={() => closeModal("delete-category")} variant="outline">
          Cancelar
        </Button>
        <Button
          disabled={isPending}
          variant="destructive"
          onClick={() => handleDelete(currentProduct?.id!)}
        >
          {isPending ? "Apagando..." : "Apagar Categoria"}
        </Button>
      </div>
    </GlobalModal>
  );
}
