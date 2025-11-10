import { ManagerData } from "@/types";
import { ManagerDataService } from "@/services/manager-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SucessMessage } from "@/utils/messages";

export function useAddManager() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ManagerData) => ManagerDataService.addManager(data),
    onSuccess: () => {
      SucessMessage("Gerente adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUpdateManager() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ManagerData> }) =>
      ManagerDataService.updateManager(id, data as any),
    onSuccess: () => {
      SucessMessage("Gerente atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useDeleteManager() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ManagerDataService.deleteManager(id),
    onSuccess: () => {
      SucessMessage("Gerente removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}