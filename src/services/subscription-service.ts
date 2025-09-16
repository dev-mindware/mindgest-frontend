import { api } from "./api";
import { SubscriptionFormData } from "@/schemas";

export const subscriptionService = {
  createSubscription: async (data: SubscriptionFormData) => {
    return api.post<any>("/subscriptions", data);
  },
};
