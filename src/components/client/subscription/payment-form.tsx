"use client";
import { UseFormReturn } from "react-hook-form";
import { PaymentTerms } from "./payment-terms";
import { SubscriptionFormData } from "@/schemas";
import { PaymentUserInfo } from "./payment-user-info";
import {
  Icon,
  Button,
  Card,
  FileUpload,
  SubscriptionSucessModal,
  SubscriptionSummary,
} from "@/components";
import { ErrorMessage, SucessMessage } from "@/utils/messages";

interface PaymentFormProps {
  form: UseFormReturn<SubscriptionFormData>;
  onBack: () => void;
  onSubmit: (data: SubscriptionFormData) => Promise<void>;
  isPending: boolean;
}

export function PaymentForm({ form, onBack, onSubmit, isPending }: PaymentFormProps) {
  const { control, handleSubmit, watch } = form;

  const subscriptionData = watch();
  const frequency = subscriptionData.frequency || "MONTHLY";

  async function handleFormSubmit(data: SubscriptionFormData) {
    if (!data.proofPayment) {
      ErrorMessage("Por favor, envie o comprovativo de pagamento");
      return;
    }

    await onSubmit(data);
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
            <h2 className="text-lg font-semibold">Método de Pagamento</h2>
            <div className="flex flex-col gap-2 text-foreground">
              <span>
                Banco: BCI
              </span>
              <div className="flex items-center gap-2">
                <span>
                  IBAN: 0005.0000.0933.1805.1011.5
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const iban = "0005.0000.0933.1805.1011.5";
                    navigator.clipboard.writeText(iban);
                    SucessMessage("IBAN copiado para a área de transferência!");
                  }}
                  className="p-1.5 hover:bg-accent rounded-md transition-colors text-primary"
                  title="Copiar IBAN"
                >
                  <Icon name="Copy" className="w-4 h-4" />
                </button>
              </div>
              <span>
                Titular: MINDWARE - COMÉRCIO E SERVIÇOS
              </span>
            </div>

            <form
              onSubmit={handleSubmit(handleFormSubmit, (errors) => {
                console.log("Validation Errors:", errors);
              })}
              className="space-y-6 mt-6"
            >
              <FileUpload
                control={control}
                name="proofPayment"
                accept={[".pdf", ".jpg", ".jpeg", ".png"]}
                label="Comprovante de Pagamento"
              />

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
          <SubscriptionSummary
            selectedPlan={subscriptionData.plan}
            months={frequency === "ANNUAL" ? 12 : 1}
            frequency={frequency as any}
          />
          <PaymentUserInfo subscriptionData={subscriptionData} />
          <PaymentTerms />
        </div>
      </div>
      <SubscriptionSucessModal />
    </div>
  );
}
