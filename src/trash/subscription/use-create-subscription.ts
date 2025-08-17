"use client";
import { useMutation } from "@tanstack/react-query";
import { SubscriptionData, subscriptionService } from "@/services";
import { SubscriptionResponse } from "@/types";

export function useCreateSubscription() {
  return useMutation<SubscriptionResponse, Error, SubscriptionData>({
    mutationFn: async (data: SubscriptionData) => {
      const response = await subscriptionService.createSubscription(data);
      return response.data;
    },
  });
}
