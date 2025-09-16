/* "use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionService } from "@/services";
import { SubscriptionResponse } from "@/types";
import { ErrorMessage, SucessMessage } from "@/utils";

export function useApproveSubscription() {
  const queryClient = useQueryClient();

  return useMutation<SubscriptionResponse, Error, string>({
    mutationFn: async (subscriptionId: string) => {
      const response = await subscriptionService.approveSubscription(
        subscriptionId
      );
      return response.data;
    },
    onSuccess: () => {
      SucessMessage("Subscrição aprovada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: (err) => {
      ErrorMessage(`Erro ao aprovar: ${err.message}`);
    },
  });
}

export function useRejectSubscription() {
  const queryClient = useQueryClient();

  return useMutation<SubscriptionResponse, Error, string>({
    mutationFn: async (subscriptionId: string) => {
      const response = await subscriptionService.rejectSubscription(
        subscriptionId
      );
      return response.data;
    },
    onSuccess: () => {
      SucessMessage("Subscrição rejeitada!");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: (err) => {
      ErrorMessage(`Erro ao rejeitar: ${err.message}`);
    },
  });
}
 */