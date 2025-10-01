import { ItemData } from "@/types";
import { itemsService } from "@/services/items-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SucessMessage, ErrorMessage } from "@/utils/messages";

export function useAddItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ItemData) => itemsService.addItem(data),
    onSuccess: () => {
      SucessMessage("Item adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useUpdateItem() {
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

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itemsService.deleteItem(id),
    onSuccess: () => {
      SucessMessage("Item removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useToggleStatusItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itemsService.toggleStatusItem(id),
    onSuccess: () => {
      SucessMessage("Status do item alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
