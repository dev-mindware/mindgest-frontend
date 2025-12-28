import { creditNoteService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateCreditNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      creditNoteService.updateCreditNote(id, data),
    onSuccess: () => {
      toast.success("Nota de crédito atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["credit-notes"] });
    },
  });
}