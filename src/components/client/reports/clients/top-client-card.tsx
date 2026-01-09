"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils";
import { Award, Mail, Calendar as CalendarIconLucide } from "lucide-react";
import { ClientAnalyticsResponse } from "@/types";

import { DynamicMetricCard } from "@/components/shared/dynamic-metric-card";

interface TopClientCardProps {
  client: ClientAnalyticsResponse["clients"][0] | undefined;
}

export function TopClientCard({ client }: TopClientCardProps) {
  if (!client) return null;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-2xl">{client.clientName}</CardTitle>
              <Badge variant="default" className="text-xs">
                Top Cliente
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-2">
              <Mail className="h-3 w-3" />
              {client.clientEmail}
            </CardDescription>
          </div>
          <Award className="h-8 w-8 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DynamicMetricCard
            title={formatCurrency(client.totalRevenue)}
            subtitle="Receita Total"
            icon="DollarSign"
            className="border-none shadow-none bg-primary/5"
          />
          <DynamicMetricCard
            title={client.totalInvoices}
            subtitle="Nº de Facturas"
            icon="Receipt"
            className="border-none shadow-none bg-primary/5"
          />
          <DynamicMetricCard
            title={formatCurrency(client.averageOrderValue)}
            subtitle="Valor Médio"
            icon="ChartBar"
            className="border-none shadow-none bg-primary/5"
          />
          <DynamicMetricCard
            title={formatDate(client.lastPurchaseDate)}
            subtitle="Última Compra"
            icon="CalendarDays"
            className="border-none shadow-none bg-primary/5"
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Score de Fidelização</p>
            <Badge variant="success" className="text-sm">
              {client.loyaltyScore}%
            </Badge>
          </div>
          <Progress value={client.loyaltyScore} className="h-3" />
        </div>
      </CardContent>
    </Card>
  );
}
