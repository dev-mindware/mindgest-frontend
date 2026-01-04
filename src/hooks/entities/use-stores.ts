import { storesResponse } from "@/types/entities";
import { useFetch } from "../common/use-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storesService } from "@/services/stores-service";
import { SucessMessage } from "@/utils/messages";
import { ItemData, StoreData } from "@/types";

export function useGetStores() {
  const { data, error, isLoading, refetch } = useFetch<storesResponse>(
    "stores",
    "/stores?page=1&limit=10"
  );

  const stores =
    data?.data.map((store) => ({
      label: `${store.name}`,
      value: store.id,
    })) || [];

  return { stores, storesData: data?.data || [], error, isLoading, refetch };
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
