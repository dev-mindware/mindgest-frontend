import { api } from "./api";
import { Subscription } from "@/types";
import { SubscriptionFormData } from "@/schemas";

type Data = Pick<SubscriptionFormData, "planId"| "billingPeriodInMonths">

export const subscriptionService = {
  createSubscription: async (data: Data) => {
    return api.post<Subscription>("/subscriptions", data);
  },
};
