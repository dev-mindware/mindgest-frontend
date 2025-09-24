"use client";
import { formatCurrency } from "@/utils";
import { useForm } from "react-hook-form";
import { PaymentTerms } from "./payment-terms";
import { SubscriptionFormData } from "@/schemas";
import { PaymentUserInfo } from "./payment-user-info";
import {
  Icon,
  Button,
  Card,
  Badge,
  SubscriptionSucessModal,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components";
import { ErrorMessage } from "@/utils/messages";
import { useCreateSubscription } from "@/hooks/susbcription";

interface PaymentFormProps {
  subscriptionData: SubscriptionFormData;
  onBack: () => void;
}

export function PaymentForm({ subscriptionData, onBack }: PaymentFormProps) {
  const { mutateAsync, isPending } = useCreateSubscription();

  const planValue = Number(subscriptionData?.plan.priceMonthly) || 0;
  const months = subscriptionData?.months || 1;
  const totalToPay = planValue * months;

  const { handleSubmit } = useForm<SubscriptionFormData>({
    defaultValues: subscriptionData,
  });

  async function onSubmit(data: SubscriptionFormData) {
    if (!data) {
      ErrorMessage("Por favor, envie o comprovativo de pagamento");
      return;
    }

    await mutateAsync(data);

    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    window.location.replace("/client/dashboard");
    localStorage.removeItem("plan-storage");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid lg:grid-cols-3 bg-pr gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col gap-4">
            <button
              onClick={onBack}
              className="w-max flex hover:text-primary transition-colors duration-300 items-center cursor-pointer gap-2"
            >
              <Icon name="ArrowLeft" className="w-4 h-4" />
              Voltar
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Finalizar Pagamento
              </h1>
              <p className="text-foreground">
                Escolha sua forma de pagamento para poder prosseguir
              </p>
            </div>
          </div>

          <Card className="p-6 border-border shadow-none">
            <h2 className="text-lg font-semibold mb-4">Método de Pagamento</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Button
                size="lg"
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3"
                disabled={isPending}
              >
                {isPending ? (
                  <Icon name="LoaderCircle" className="animate-spin" />
                ) : (
                  "Finalizar Pagamento"
                )}
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                Resumo da Assinatura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Plano selecionado:</span>
                <Badge className="bg-primary-500 text-white">
                  {subscriptionData?.plan.name}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span>Período:</span>
                <span>
                  {months} {months === 1 ? "mês" : "meses"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Valor do plano:</span>
                <span>{formatCurrency(planValue)} / mês</span>
              </div>

              <hr className="border-border" />

              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total a Pagar:</span>
                <span className="text-primary-600">
                  {formatCurrency(totalToPay)}
                </span>
              </div>
            </CardContent>
          </Card>
          <PaymentUserInfo subscriptionData={subscriptionData} />
          <PaymentTerms />
        </div>
      </div>
      <SubscriptionSucessModal />
    </div>
  );
}
