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
import { formatCurrency } from "@/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

export function SubscriptionInfo() {
  const { user } = useAuth();
  const subscription = user?.company?.subscription;
  const plan = subscription?.plan;

  if (!subscription || !plan) {
    return (
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle>Nenhum plano ativo</CardTitle>
          <CardDescription>
            Parece que você ainda não possui uma subscrição ativa.
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
  const endDate = isTrial
    ? subscription.trialEndsAt
    : subscription.periodEndsAt;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-2xl">Plano {plan.name}</CardTitle>
            <CardDescription>
              Gerencie os detalhes da sua subscrição
            </CardDescription>
          </div>
          <Badge
            variant={isTrial ? "secondary" : "default"}
            className="px-3 py-1"
          >
            {isTrial ? "Período de Teste" : "Ativo"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Preço Mensal
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(Number(plan.priceMonthly))}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  /mês
                </span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {isTrial ? "Expira em" : "Próximo Faturamento"}
              </p>
              <p className="text-lg font-semibold">
                {endDate
                  ? format(new Date(endDate), "dd 'de' MMMM, yyyy", {
                      locale: ptBR,
                    })
                  : "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Intervalo
              </p>
              <p className="text-lg font-semibold capitalize">
                {subscription.billingInterval || "Mensal"}
              </p>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Limites e Funcionalidades
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 border border-border">
                <Icon name="Users" className="text-primary" size={20} />
                <div>
                  <p className="text-sm font-medium">Usuários</p>
                  <p className="text-xs text-muted-foreground">
                    Até {plan.maxUsers === -1 ? "ilimitados" : plan.maxUsers}{" "}
                    colaboradores
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 border border-border">
                <Icon name="LayoutGrid" className="text-primary" size={20} />
                <div>
                  <p className="text-sm font-medium">Lojas/Espaços</p>
                  <p className="text-xs text-muted-foreground">
                    Até {plan.maxStores === -1 ? "ilimitado" : plan.maxStores}{" "}
                    {plan.maxStores === 1 ? "loja" : "lojas"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full sm:flex-row gap-3">
            <Link href="/plans">
              <Button className="w-max gap-2" variant="default">
                <Icon name="ArrowUpToLine" size={16} />
                Upgrade de Plano
              </Button>
            </Link>
            <Button variant="outline" className="w-max gap-2">
              <Icon name="ReceiptText" size={16} />
              Ver Faturas
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-3">
        <Icon name="Info" className="text-primary shrink-0 mt-0.5" size={18} />
        <div className="text-sm space-y-1">
          <p className="font-semibold text-primary">
            Precisa de algo personalizado?
          </p>
          <p className="text-muted-foreground">
            Se o seu negócio precisa de limites maiores ou funcionalidades
            específicas, entre em contacto com o nosso suporte comercial.
          </p>
        </div>
      </div>
    </div>
  );
}
