import { useModal } from "@/stores/use-modal-store";
import { Button, GlobalModal } from "@/components"; 
import { currentServiceStore } from "@/stores";
export function SeeService() {
  const { closeModal } = useModal();
  const { currentService } = currentServiceStore();

  return (
    <GlobalModal
      id="details-service"
      title="Detalhes do serviço"
      description="Está a ver os detalhes do produto"
      canClose
      footer={
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => closeModal("details-service")}
            variant={"outline"}
          >
            Fechar
          </Button>
        </div>
      }
    >
      <code>{JSON.stringify(currentService, null, 2)}</code>
    </GlobalModal>
  );
}
