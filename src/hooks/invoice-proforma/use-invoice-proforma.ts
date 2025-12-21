import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { proformaService } from "@/services";
import { ProformData } from "@/types";

export function useDeleteProforma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proformaService.deleteProforma(id),
    onSuccess: () => {
      toast.success("Proforma deletada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoice-proforma"] });
    },
  });
}

export function useCreateProforma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProformData) => proformaService.createProforma(data),
    onSuccess: () => {
      toast.success("Proforma criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoice-proforma"] });
    },
  });
}
