import { Button, GlobalModal } from "@/components";
import { currentServiceStore } from "@/stores";
import { useModal } from "@/stores/use-modal-store";

export function DeleteService() {
  const { closeModal } = useModal();
  const { currentService } = currentServiceStore();

  return (
    <GlobalModal
      id="delete-service"
      title="Tem certeza que deseja apagar o serviço?"
      description="Lembre-se que esta ação não pode ser desfeita."
      className="!w-max "
      warning
      canClose
      footer={
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => closeModal("delete-service")}
            variant="outline"
          >
            Fechar
          </Button>
          <Button
            onClick={() => closeModal("delete-service")}
            variant="destructive"
          >
            Apagar
          </Button>
        </div>
      }
    >
      <h1 className="text-center">{currentService?.name}</h1>
    </GlobalModal>
  );
}
