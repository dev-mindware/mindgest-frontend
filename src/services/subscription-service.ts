import { Subscription } from "@/types";
import { api } from "./api";
import { SubscriptionFormData } from "@/schemas";

type Data = Pick<SubscriptionFormData, "planId"| "billingPeriodInMonths">

export const subscriptionService = {
  createSubscription: async (data: Data) => {
    return api.post<Subscription>("/subscriptions", data);
  },
};
