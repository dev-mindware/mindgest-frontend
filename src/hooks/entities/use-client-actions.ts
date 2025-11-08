import { useModal } from "@/stores/use-modal-store";
import { ClientResponse } from "@/types";
import { currentClientStore } from "@/stores/entities";

export function useClientActions() {
  const { openModal } = useModal();
  const { setCurrentClient } = currentClientStore();

  function handlerEditClient(client: ClientResponse) {
    openModal("edit-client");
    setCurrentClient(client);
  }

  function handlerDetailsClient(client: ClientResponse) {
    openModal("view-client");
    setCurrentClient(client);
  }

  function handlerDeleteClient(client: ClientResponse) {
    openModal("delete-client");
    setCurrentClient(client);
  }

  return {
    handlerDeleteClient,
    handlerDetailsClient,
    handlerEditClient,
  };
}
