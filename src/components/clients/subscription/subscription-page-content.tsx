"use client";
import { useState } from "react";
import { SubscriptionFormData } from "@/schemas";
import { SubscriptionForm } from "./subscription-form";
import { PaymentForm } from "./payment-form";

type CurrentStep = "subscription" | "payment";

export function SubscriptionPageContent() {
  const [currentStep, setCurrentStep] = useState<CurrentStep>("subscription");
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionFormData | null>(null);

  function handleSubscriptionNext(data: SubscriptionFormData) {
    setSubscriptionData(data);
    setCurrentStep("payment");
  }

  function handlePaymentBack() {
    setCurrentStep("subscription");
  }

  return (
    <div className="min-h-screen bg-background">
      {currentStep === "subscription" ? (
        <SubscriptionForm onNext={handleSubscriptionNext} />
      ) : subscriptionData ? (
        <PaymentForm
          onBack={handlePaymentBack}
          subscriptionData={subscriptionData}
        />
      ) : null}
    </div>
  );
}
