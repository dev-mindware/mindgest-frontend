import { creditNoteService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SucessMessage } from "@/utils/messages";

export function useUpdateCreditNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      creditNoteService.updateCreditNote(id, data),
    onSuccess: () => {
      SucessMessage("Nota de crédito actualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["credit-notes"] });
    },
  });
}
