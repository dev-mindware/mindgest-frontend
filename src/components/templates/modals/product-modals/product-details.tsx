import { useModal } from "@/stores/use-modal-store";
import { Button, GlobalModal } from "@/components"; 
import { currentProductStore } from "@/stores";
export function SeeProduct() {
  const { closeModal } = useModal();
  const { currentProduct } = currentProductStore();

  return (
    <GlobalModal
      id="details-product"
      title="Detalhes do producto"
      description="Está a ver os detalhes do produto"
      canClose
      footer={
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => closeModal("details-product")}
            variant={"outline"}
          >
            Fechar
          </Button>
        </div>
      }
    >
      <code>{JSON.stringify(currentProduct, null, 2)}</code>
    </GlobalModal>
  );
}
