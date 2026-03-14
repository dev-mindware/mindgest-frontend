"use client";
import { useModal } from "@/stores";
import { useForm } from "react-hook-form";
import { PaymentForm } from "./payment-form";
import { ErrorMessage } from "@/utils/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubscriptionFormData, subscriptionSchema } from "@/schemas";
import { useFileUpload } from "@/hooks/common/use-upload";

export function SubscriptionPageContent() {
  const { openModal } = useModal();
  const { mutateAsync: uploadFile, isPending } = useFileUpload(
    "/subscriptions",
    "subscriptions",
    "POST",
  );

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      status: "PENDING_PAYMENT",
      frequency: "MONTHLY",
      proofPayment: null,
    },
  });

  async function handlePaymentSubmit(data: SubscriptionFormData) {
    try {
      if (!data.proofPayment) {
        ErrorMessage("Por favor, envie o comprovativo de pagamento");
        return;
      }

      await uploadFile({
        files: {
          proofPayment: data.proofPayment,
        },
        extraData: {
          frequency: data.frequency,
          planId: data.planId,
        },
      });

      openModal("subscription-created");
      localStorage.removeItem("MGEST-PLAN-STORE");
    } catch (error: any) {
      if (error?.response) {
        ErrorMessage(error?.response?.data?.message);
      } else {
        ErrorMessage("Ocorreu um erro ao criar a assinatura. Tente novamente.");
      }
    }
  }

  return (
    <div className="bg-background">
      <PaymentForm
        form={form}
        onSubmit={handlePaymentSubmit}
        isPending={isPending}
      />
    </div>
  );
}
