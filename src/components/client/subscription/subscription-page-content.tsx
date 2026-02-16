"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubscriptionFormData, subscriptionSchema } from "@/schemas";
import { SubscriptionForm } from "./subscription-form";
import { PaymentForm } from "./payment-form";
import { useCreateSubscription } from "@/hooks/susbcription";
import { ErrorMessage } from "@/utils/messages";

type CurrentStep = "subscription" | "payment";

export function SubscriptionPageContent() {
  const [currentStep, setCurrentStep] = useState<CurrentStep>("subscription");
  const { mutateAsync, isPending } = useCreateSubscription();

  // Single form instance for the entire flow
  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      status: "PENDING_PAYMENT",
      frequency: "MONTHLY",
      proofPayment: null,
    },
  });

  async function handleSubscriptionNext() {
    // Validate subscription step fields before proceeding
    const isValid = await form.trigger(["planId", "frequency", "name", "email", "company", "phone"]);

    if (isValid) {
      setCurrentStep("payment");
    }
  }

  function handlePaymentBack() {
    setCurrentStep("subscription");
  }

  async function handlePaymentSubmit(data: SubscriptionFormData) {
    if (!data.proofPayment) {
      ErrorMessage("Por favor, envie o comprovativo de pagamento");
      return;
    }

    await mutateAsync(data);

    window.location.replace("/owner/dashboard");
    localStorage.removeItem("plan-storage");
  }

  return (
    <div className="min-h-screen bg-background">
      {currentStep === "subscription" ? (
        <SubscriptionForm form={form} onNext={handleSubscriptionNext} />
      ) : (
        <PaymentForm
          form={form}
          onBack={handlePaymentBack}
          onSubmit={handlePaymentSubmit}
          isPending={isPending}
        />
      )}
    </div>
  );
}
