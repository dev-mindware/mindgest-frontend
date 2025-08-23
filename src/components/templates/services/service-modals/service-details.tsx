import { useModal } from "@/stores/use-modal-store";
import { Badge, Button, GlobalModal, Icon } from "@/components";
import { currentServiceStore } from "@/stores";
import { formatPrice } from "@/utils";
export function SeeService() {
  const { closeModal } = useModal();
  const { currentService } = currentServiceStore();

  return (
    <GlobalModal
      id="details-service"
      title="Detalhes do serviço"
      className="!max-h-[85vh] !w-max"
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
      <div className="space-y-4 w-[20rem]">
        <div className="flex items-center justify-center p-2 mx-auto rounded-full w-18 h-18 bg-primary/10">
          <Icon name="Store" className="w-16 h-16 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-center">{currentService?.title}</h2>
        <div className="flex justify-between gap-1">
          <div className="p-2 border rounded-md text-md border-muted text-muted-foreground"><span>{currentService?.category}</span></div>
          <div>
          <Badge
            variant="secondary"
            className={
              currentService?.isActive
                ? "text-xs text-green-700 bg-green-100 border-green-200"
                : "text-xs text-red-700 bg-red-100 border-red-200"
            }
          >
            {currentService?.isActive ? "Ativo" : "Inactivo"}
          </Badge>
          </div>
        </div>
          <p className="text-sm text-muted-foreground">Preço:</p>
          <h2 className="text-3xl font-semibold text-center text-primary">{formatPrice(currentService?.price ?? 0)}</h2>
        <p className="text-sm text-muted-foreground">Descrição: {currentService?.description}</p>
      </div>
    </GlobalModal>
  );
}
