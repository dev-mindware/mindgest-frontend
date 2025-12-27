"use client";

import { formatCurrency } from "@/utils";
import { SalesSummary } from "@/types/reports";
import { DynamicMetricCard } from "@/components/shared";

interface SalesSummaryCardsProps {
    summary: SalesSummary;
}

export function SalesSummaryCards({ summary }: SalesSummaryCardsProps) {
    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <DynamicMetricCard
                title={formatCurrency(summary.totalRevenue)}
                subtitle="Receita Total"
                description="Valor total de vendas no período"
            />

            <DynamicMetricCard
                title={summary.totalTransactions.toLocaleString("pt-AO")}
                subtitle="Total de Transações"
                description="Número de vendas realizadas"
            />

            <DynamicMetricCard
                title={formatCurrency(summary.averageTicket)}
                subtitle="Ticket Médio"
                description="Valor médio por transação"
            />
        </div>
    );
}
