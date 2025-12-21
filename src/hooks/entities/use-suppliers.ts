import { SupplierData, ItemData } from "@/types";
import { suppliersService } from "@/services/suppliers-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SucessMessage } from "@/utils/messages";
import { useAuthStore } from "@/stores";

export function useAddSupplier() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (data: SupplierData) => suppliersService.addSupplier(data),
    onSuccess: () => {
      SucessMessage("Fornecedor adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemData> }) =>
      suppliersService.updateSupplier(id, data as any),
    onSuccess: () => {
      SucessMessage("Fornecedor atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => suppliersService.deleteSupplier(id),
    onSuccess: () => {
      SucessMessage("Fornecedor removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}
