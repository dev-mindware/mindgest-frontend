import { api } from "./api";
import { SubscriptionResponse } from "@/types/subscription";

export type SubscriptionData = {
  planId: string;
  quantity: number;
};

export const subscriptionService = {
  createSubscription: async (data: SubscriptionData) =>
    api.post<SubscriptionResponse>("/subscription", data),
};
