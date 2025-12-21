import { useModal } from "@/stores/use-modal-store";
import { StoreResponse } from "@/types";
import { currentStoreStore } from "@/stores/entities";
import { useToggleStatusStore } from "../entities";

export function useStoreActions() {
  const { openModal } = useModal();
  const { setCurrentStore } = currentStoreStore();
  const { mutateAsync: toggleStatus } = useToggleStatusStore();

  function handlerEditStore(store: StoreResponse) {
    openModal("edit-store");
    setCurrentStore(store);
  }

  function handlerDetailsStore(store: StoreResponse) {
    openModal("view-store");
    setCurrentStore(store);
  }

  function handlerDeleteStore(store: StoreResponse) {
    openModal("delete-store");
    setCurrentStore(store);
  }

  async function toggleStatusStore(store: StoreResponse) {
    setCurrentStore(store);
    await toggleStatus(store.id);
  }

  return {
    handlerDeleteStore,
    handlerDetailsStore,
    handlerEditStore,
    toggleStatusStore,
  };
}
