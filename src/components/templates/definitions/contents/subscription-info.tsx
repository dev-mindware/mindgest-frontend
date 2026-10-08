"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
} from "@/components";
import { useAuth } from "@/hooks/auth";
import { subscriptionService } from "@/services/subscription-service";
import { formatCurrency, getPlanFeatures } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { Subscription } from "@/types";

interface BillingCycleDetails {
  label: string;
  cycleName: string;
  months: number;
  discountPercentage: number;
  priceLabel: string;
  totalPrice: number;
  monthlyEquivalent: number;
  discountAmount: number;
}

function getBillingCycleDetails(
  subscription?: Partial<Subscription> | null,
  priceMonthlyRaw?: string | number,
): BillingCycleDetails {
  const priceMonthly = Number(priceMonthlyRaw || 0);

  let months = 1;
  const rawMonths = subscription?.billingPeriodInMonths;
  const rawInterval = String(subscription?.billingInterval || "").toUpperCase();

  if (rawMonths !== undefined && rawMonths !== null && !isNaN(Number(rawMonths))) {
    const parsed = Number(rawMonths);
    if (parsed === 12 || parsed === 6 || parsed === 1) {
      months = parsed;
    }
  } else if (rawInterval.includes("ANNUAL") || rawInterval.includes("YEAR")) {
    months = 12;
  } else if (rawInterval.includes("SEMI")) {
    months = 6;
  }

  if (months === 12) {
    const rawTotal = priceMonthly * 12;
    const discountAmount = rawTotal * 0.05;
    const totalPrice = Math.max(0, rawTotal - discountAmount);
    return {
      label: "Anual",
      cycleName: "12 Meses",
      months: 12,
      discountPercentage: 5,
      priceLabel: "Preço Anual",
      totalPrice,
      monthlyEquivalent: totalPrice / 12,
      discountAmount,
    };
  }

  if (months === 6) {
    const rawTotal = priceMonthly * 6;
    const discountAmount = rawTotal * 0.02;
    const totalPrice = Math.max(0, rawTotal - discountAmount);
    return {
      label: "Semestral",
      cycleName: "6 Meses",
      months: 6,
      discountPercentage: 2,
      priceLabel: "Preço Semestral",
      totalPrice,
      monthlyEquivalent: totalPrice / 6,
      discountAmount,
    };
  }

  return {
    label: "Mensal",
    cycleName: "1 Mês",
    months: 1,
    discountPercentage: 0,
    priceLabel: "Preço Mensal",
    totalPrice: priceMonthly,
    monthlyEquivalent: priceMonthly,
    discountAmount: 0,
  };
}

export function SubscriptionInfo() {
  const { user } = useAuth();

  const {
    data: liveSubscription,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["company-subscription"],
    queryFn: async () => {
      try {
        const { data } = await subscriptionService.getCompanySubscription();
        return data as Subscription;
      } catch {
        return null;
      }
    },
    initialData: (user?.company?.subscription as unknown as Subscription) ?? null,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const subscription = liveSubscription || (user?.company?.subscription as unknown as Subscription);
  const plan = subscription?.plan;

  if (!subscription || !plan) {
    return (
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle>Nenhum plano ativo</CardTitle>
          <CardDescription>
            Ainda não existe uma subscrição ativa associada à sua empresa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/plans">
            <Button className="gap-2">
              <Icon name="Zap" size={16} />
              Ver Planos Disponíveis
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const isTrial = subscription.status === "TRIALING";
  const isPending = subscription.status === "PENDING";
  const endDateStr = isTrial
    ? subscription.trialEndsAt
    : subscription.periodEndsAt;

  const endDate = endDateStr ? new Date(endDateStr) : null;
  const now = new Date();

  const isExpired =
    subscription.status === "EXPIRED" ||
    subscription.status === "CANCELED" ||
    subscription.status === "PAST_DUE" ||
    (endDate ? endDate.getTime() < now.getTime() : false);

  const daysDiff = endDate ? differenceInDays(endDate, now) : null;

  const cycle = getBillingCycleDetails(subscription, plan.priceMonthly);
  const featuresList = getPlanFeatures(plan);

  return (
    <div className="space-y-6">
      <Card className={isExpired ? "border-destructive/40 ring-1 ring-destructive/20" : ""}>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <CardTitle className="text-2xl font-bold">Plano {plan.name}</CardTitle>
              <Badge
                variant={
                  isExpired
                    ? "destructive"
                    : isTrial
                      ? "secondary"
                      : isPending
                        ? "pending"
                        : "default"
                }
                className="px-3 py-1 font-medium text-xs"
              >
                {isExpired
                  ? "Expirado"
                  : isTrial
                    ? "Período de Teste"
                    : isPending
                      ? "Pendente de Aprovação"
                      : "Subscrição Ativa"}
              </Badge>
              <Badge variant="outline" className="text-xs font-medium">
                {cycle.label === "Anual"
                  ? "Plano Anual (-5%)"
                  : cycle.label === "Semestral"
                    ? "Plano Semestral (-2%)"
                    : "Plano Mensal"}
              </Badge>
            </div>
            <CardDescription>
              Gerir os detalhes, ciclo de faturação e recursos do seu plano.
            </CardDescription>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="self-start sm:self-auto gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            title="Atualizar dados da subscrição"
          >
            <Icon
              name="RotateCw"
              size={14}
              className={isRefetching ? "animate-spin" : ""}
            />
            <span>{isRefetching ? "A atualizar..." : "Atualizar"}</span>
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Valor da Subscrição */}
            <div className="p-4 rounded-lg bg-muted/40 border space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {cycle.priceLabel}
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(cycle.totalPrice)}
              </p>
              {cycle.months > 1 ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {formatCurrency(cycle.monthlyEquivalent)}/mês • {cycle.discountPercentage}% desconto
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Faturado mensalmente
                </p>
              )}
            </div>

            {/* Intervalo de Faturação */}
            <div className="p-4 rounded-lg bg-muted/40 border space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Intervalo
              </p>
              <p className="text-xl font-bold capitalize text-foreground">
                {cycle.label}
              </p>
              <p className="text-xs text-muted-foreground">
                Ciclo de {cycle.cycleName}
              </p>
            </div>

            {/* Data de Vencimento / Próxima Faturação */}
            <div className="p-4 rounded-lg bg-muted/40 border space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {isExpired
                  ? "Expirou em"
                  : isTrial
                    ? "Fim do Teste"
                    : isPending
                      ? "Validade Prevista"
                      : "Próxima Faturação"}
              </p>
              <p
                className={`text-base font-semibold leading-tight ${
                  isExpired ? "text-destructive" : "text-foreground"
                }`}
              >
                {endDate
                  ? format(endDate, "dd 'de' MMMM, yyyy", { locale: ptBR })
                  : "N/A"}
              </p>
              {daysDiff !== null && (
                <p
                  className={`text-xs font-medium ${
                    daysDiff < 0
                      ? "text-destructive"
                      : daysDiff <= 5
                        ? "text-amber-500"
                        : "text-muted-foreground"
                  }`}
                >
                  {daysDiff < 0
                    ? `Expirou há ${Math.abs(daysDiff)} dias`
                    : daysDiff === 0
                      ? "Expira hoje"
                      : `Restam ${daysDiff} dias`}
                </p>
              )}
            </div>

            {/* Capacidade e Limites */}
            <div className="p-4 rounded-lg bg-muted/40 border space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Capacidade do Plano
              </p>
              <p className="text-sm font-semibold text-foreground">
                {plan.maxStores > 0 ? `${plan.maxStores} Loja(s)` : "Lojas Ilimitadas"}
              </p>
              <p className="text-xs text-muted-foreground">
                {plan.maxUsers > 0 ? `${plan.maxUsers} Utilizador(es)` : "Utilizadores Ilimitados"}
              </p>
            </div>
          </div>

          {/* Banner de Comprovativo se estiver Pendente ou Anexado */}
          {subscription.proofFileUrl && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Icon name="FileText" size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Comprovativo de Pagamento Enviado
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isPending
                      ? "O seu comprovativo está a ser validado pela equipa de suporte."
                      : "Comprovativo associado a esta subscrição."}
                  </p>
                </div>
              </div>
              <a
                href={subscription.proofFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Icon name="ExternalLink" size={13} />
                  Ver Comprovativo
                </Button>
              </a>
            </div>
          )}

          {/* Recursos Inclusos no Plano */}
          <div className="rounded-lg border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Icon name="Shield" className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">
                Recursos Inclusos no Plano {plan.name}
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {featuresList.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-foreground">
                  <Icon name="Check" className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link href="/plans" className={isPending ? "pointer-events-none" : ""}>
              <Button
                className="gap-2 w-full sm:w-auto"
                disabled={isPending}
                variant={isExpired ? "default" : "outline"}
              >
                <Icon name={isExpired ? "RotateCw" : "ArrowUpToLine"} size={16} />
                {isExpired ? "Renovar Subscrição" : "Atualizar / Mudar de Plano"}
              </Button>
            </Link>

            <Link href="/documents">
              <Button variant="ghost" className="gap-2 w-full sm:w-auto text-xs text-muted-foreground hover:text-foreground">
                <Icon name="FileText" size={16} />
                Ver Faturas Emitidas
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
