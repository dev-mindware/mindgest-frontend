import { api } from "./api";
import { Subscription } from "@/types";
import { SubscriptionFormData } from "@/schemas";

type Data = Pick<
  SubscriptionFormData,
  "planId" | "frequency" | "proofPayment" | "status"
>;

export const subscriptionService = {
  createSubscription: async (data: Data) => {
    return api.post<Subscription>("/subscriptions", data);
  },
};
