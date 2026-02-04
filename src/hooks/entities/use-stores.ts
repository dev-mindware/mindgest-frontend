import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storesService } from "@/services/stores-service";
import { SucessMessage } from "@/utils/messages";
import { Role, StoreData } from "@/types";
import { useFetch } from "../common/use-fetch";
import { StoresResponse } from "@/types/entities";

export function useGetStores(role?: Role, enabled: boolean = true) {
  const route = role === "OWNER" ? "stores" : "stores/my-stores";

  const { data, error, isLoading, refetch } = useFetch<StoresResponse>(
    "stores",
    `${route}?page=1&limit=10`,
    { enabled },
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
    mutationFn: ({ id, data }: { id: string; data: Partial<StoreData> }) =>
      storesService.updateStore(id, data),
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

import { currentStoreStore } from "@/stores";
import { StoreResponse } from "@/types";

export function useSwitchStore() {
  const queryClient = useQueryClient();
  const setCurrentStore = currentStoreStore((state) => state.setCurrentStore);

  return useMutation({
    mutationFn: async (store: StoreResponse) => {
      setCurrentStore(store);
      return store;
    },
    onSuccess: () => {
      // Invalidate all queries to refresh data with the new storeId
      queryClient.invalidateQueries();
    },
  });
}
