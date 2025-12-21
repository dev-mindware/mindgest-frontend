import { useModal } from "@/stores/use-modal-store";
import { CollaboratorResponse } from "@/types";
import { currentCollaboratorStore } from "@/stores/collaborators";
import { useToggleStatusCollaborator } from "../collaborators";

export function useCollaboratorActions() {
  const { openModal } = useModal();
  const { setCurrentCollaborator } = currentCollaboratorStore();
  const { mutateAsync: toggleStatus } = useToggleStatusCollaborator();

  function handlerEditCollaborator(collaborator: CollaboratorResponse) {
    openModal("edit-collaborator");
    setCurrentCollaborator(collaborator);
  }

  function handlerDetailsCollaborator(collaborator: CollaboratorResponse) {
    openModal("view-collaborator");
    setCurrentCollaborator(collaborator);
  }

  function handlerDeleteCollaborator(collaborator: CollaboratorResponse) {
    openModal("delete-collaborator");
    setCurrentCollaborator(collaborator);
  }

  async function toggleStatusCollaborator(collaborator: CollaboratorResponse) {
    setCurrentCollaborator(collaborator);
    await toggleStatus(collaborator.id);
  }

  return {
    handlerDeleteCollaborator,
    handlerDetailsCollaborator,
    handlerEditCollaborator,
    toggleStatusCollaborator,
  };
}
