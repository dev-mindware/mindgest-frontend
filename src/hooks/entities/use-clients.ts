import { ItemData } from "@/types";
import { itemsService } from "@/services/items-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SucessMessage, ErrorMessage } from "@/utils/messages";

export function useAddClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ItemData) => itemsService.addItem(data),
    onSuccess: () => {
      SucessMessage("Item adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemData> }) =>
      itemsService.updateItem(id, data as any),
    onSuccess: () => {
      SucessMessage("Item atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itemsService.deleteItem(id),
    onSuccess: () => {
      SucessMessage("Item removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
