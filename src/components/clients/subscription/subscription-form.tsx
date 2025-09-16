"use client";
import {
  Card,
  Input,
  Button,
  CardTitle,
  AlertError,
  CardHeader,
  CardContent,
  CardDescription,
  RequestError,
  SubscriptionSkeleton,
  SubscriptionSummary,
} from "@/components";
import { Plan } from "@/types";
import { usePlans } from "@/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PlanCard } from "./plan-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore, useCurrentPlanStore } from "@/stores";
import { ErrorMessage } from "@/utils/messages";
import { SubscriptionFormData, subscriptionSchema } from "@/schemas";

interface SubscriptionFormProps {
  onNext: (data: SubscriptionFormData) => void;
}

export function SubscriptionForm({ onNext }: SubscriptionFormProps) {
  const { user } = useAuthStore();
  const { plans, error, isLoading, refetch } = usePlans();
  const { currentPlanSelected, setCurrentPlanSelected } = useCurrentPlanStore();
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      status: "PENDING_PAYMENT",
      months: 1,
    }
  })
 
  useEffect(() => {
    if (plans.length > 0) {
      if (currentPlanSelected) {
        setValue("plan", currentPlanSelected);
        setValue("planId", currentPlanSelected.id)
        
      } else {
        setValue("plan", plans[0]);
        setValue("planId", plans[0].id)
        setCurrentPlanSelected(plans[0]);
      }
      
      setValue("companyId", user?.company?.id || "");
      setValue("name", user?.name || "");
      setValue("email", user?.email || "");
      setValue("company", user?.company?.name || "");
      setValue("phone", user?.company?.phone || "");
    }
  }, [plans, currentPlanSelected, setValue, setCurrentPlanSelected, user]);

  if (isLoading) return <SubscriptionSkeleton />;
  if (error) return <RequestError refetch={refetch} />;

  const handleNext = (data: SubscriptionFormData) => {
    if (!currentPlanSelected) {
      ErrorMessage("Por favor, selecione um plano.");
      return;
    }

    onNext({
      ...data,
      planId: currentPlanSelected.id,
      status: "PENDING_PAYMENT",
    });
  };

  const handlePlanSelect = (plan: Plan) => {
    setCurrentPlanSelected(plan);
    setValue("plan", plan);
  };

  if (!plans.length) {
    return <p className="text-foreground">Nenhum plano disponível</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl text-primary-500">
              Dados para Assinatura
            </CardTitle>
            <CardDescription className="text-foreground">
              Preencha suas informações para poder subscrever
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Informações da Empresa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    readOnly
                    label="Nome do Cliente"
                    {...register("name")}
                    defaultValue={user?.name || "Cliente"}
                    className="border-border focus:border-primary-500 focus:ring-primary-500"
                  />
                  <Input
                    readOnly
                    label="Empresa"
                    {...register("company")}
                    defaultValue={user?.company?.name || "Empresa"}
                    className="border-border focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    readOnly
                    type="email"
                    label="E-mail"
                    {...register("email")}
                    defaultValue={user?.company?.email || "seu@email.com"}
                    className="border-border focus:border-primary-500 focus:ring-primary-500"
                  />
                  <Input
                    readOnly
                    label="Telefone"
                    {...register("phone")}
                    defaultValue={user?.company?.phone || "9xxxxxxxx"}
                    className="border-border focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Escolha seu Plano
                </h3>
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <PlanCard
                      plan={plan}
                      key={plan.id}
                      isSelected={currentPlanSelected?.id === plan.id}
                      onSelect={() => handlePlanSelect(plan)}
                    />
                  ))}
                </div>
                {errors.plan?.id && (
                  <AlertError errorMessage={errors.plan.id.message} />
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Duração da Assinatura
                </h3>
                <Input
                  min={1}
                  type="number"
                  defaultValue={watch("months")}
                  label="Meses (Número de meses que deseja assinar)"
                  {...register("months", { valueAsNumber: true })}
                  className="border-border focus:border-primary-500 focus:ring-primary-500"
                  error={errors?.months && errors?.months?.message}
                />
              </div>

              <Button
                type="button"
                onClick={handleSubmit(handleNext)}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white text-sm py-3 font-semibold"
              >
                Avançar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <SubscriptionSummary
          months={watch("months")}
          selectedPlan={currentPlanSelected}
        />
      </div>
    </div>
  );
}
