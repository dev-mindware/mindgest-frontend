import { StoreData, ItemData, StoreList } from "@/types";
import { storesService } from "@/services/stores-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SucessMessage } from "@/utils/messages";
import { useFetch } from "../common/use-fetch";

export function useAddStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StoreData) => storesService.addStore(data),
    onSuccess: () => {
      SucessMessage("Loja adicionada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemData> }) =>
      storesService.updateStore(id, data as any),
    onSuccess: () => {
      SucessMessage("Loja atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => storesService.deleteStore(id),
    onSuccess: () => {
      SucessMessage("Loja removida com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}

export function useGetStores() {
  const { data, error, isLoading, refetch } = useFetch<any>(
    "stores",
    "/stores?page=1&limit=10"
  );

  const stores =
    data?.data?.map((store: StoreData) => ({
      label: store.name,
      value: store.id,
    })) || [];

  return { stores, error, isLoading, refetch };
}

export function useToggleStatusStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => storesService.toggleStatusStore(id),
    onSuccess: () => {
      SucessMessage("Status alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}
