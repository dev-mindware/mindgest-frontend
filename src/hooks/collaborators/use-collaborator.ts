import { CollaboratorData } from "@/types";
import { collaboratorDataService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SucessMessage } from "@/utils/messages";

export function useAddCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CollaboratorData) =>
      collaboratorDataService.addCollaborator(data),
    onSuccess: () => {
      SucessMessage("Colaborador adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
    },
  });
}

export function useUpdateCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CollaboratorData>;
    }) => collaboratorDataService.updateCollaborator(id, data as any),
    onSuccess: () => {
      SucessMessage("Colaborador atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
    },
  });
}

export function useDeleteCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collaboratorDataService.deleteCollaborator(id),
    onSuccess: () => {
      SucessMessage("Colaborador removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
    },
  });
}

export function useToggleStatusCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collaboratorDataService.toggleStatusCollaborator(id),
    onSuccess: () => {
      SucessMessage("Status alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
    },
  });
}
