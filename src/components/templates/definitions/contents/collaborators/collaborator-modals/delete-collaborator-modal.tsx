import { Button, GlobalModal } from "@/components";
import { useDeleteCollaborator } from "@/hooks/collaborators/use-collaborator";
import { currentCollaboratorStore } from "@/stores/collaborators/current-collaborator-store";
import { useModal } from "@/stores/modal/use-modal-store";
import { ErrorMessage } from "@/utils/messages";

export function DeleteCollaboratorModal() {
  const { closeModal, open } = useModal();
  const isOpen = open["delete-collaborator"];
  const { currentCollaborator } = currentCollaboratorStore();
  const { mutateAsync: deleteItemMutate, isPending } = useDeleteCollaborator();

  async function handleDelete(id: string) {
    if (!currentCollaborator) return;
    try {
      await deleteItemMutate(id);
      closeModal("delete-collaborator");
    } catch (error: any) {
      if (error?.response) {
        ErrorMessage(
          error.response.data.message || `Erro ao apagar o colaborador.`
        );
      } else {
        ErrorMessage(
          `Ocorreu um erro desconhecido ao apagar o colaborador. Tente novamente.`
        );
      }
    }
  }

  if (!isOpen) return null;

  return (
    <GlobalModal
      warning
      canClose
      className="!w-max"
      id="delete-collaborator"
      title={`Tem certeza que deseja apagar o colaborador ${currentCollaborator?.name}?`}
      description="Lembre-se que esta ação não pode ser desfeita."
    >
      <div className="flex justify-end gap-4">
        <Button
          onClick={() => closeModal("delete-collaborator")}
          variant="outline"
        >
          Cancelar
        </Button>
        <Button
          disabled={isPending}
          variant="destructive"
          onClick={() => handleDelete(currentCollaborator?.id!)}
        >
          {isPending ? "Apagando..." : `Apagar ${currentCollaborator?.name}`}
        </Button>
      </div>
    </GlobalModal>
  );
}
