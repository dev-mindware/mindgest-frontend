import { Service } from "@/types";
import { useModal } from "@/stores/use-modal-store";
import { currentServiceStore } from "@/stores";

export function useServiceActions() {
  const { openModal } = useModal();
  const { setCurrentService } = currentServiceStore();

  function handlerEditService(service: Service) {
    openModal("edit-service");
    setCurrentService(service);
  }

  function handlerDetailsService(service: Service) {
    openModal("details-service");
    setCurrentService(service);
  }

  function handlerDeleteService(service: Service) {
    openModal("delete-service");
    setCurrentService(service);
  }

  return {
    handlerDeleteService,
    handlerDetailsService,
    handlerEditService,
  };
}
