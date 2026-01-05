"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Receipt } from "lucide-react";
import { formatCurrency } from "@/utils";
import { SalesSummary } from "@/types/reports";

interface SalesSummaryCardsProps {
    summary: SalesSummary;
}

export function SalesSummaryCards({ summary }: SalesSummaryCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Receita Total
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatCurrency(summary.totalRevenue)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Valor total de vendas no período
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total de Transações
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {summary.totalTransactions.toLocaleString("pt-AO")}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Número de vendas realizadas
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Ticket Médio
                    </CardTitle>
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatCurrency(summary.averageTicket)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Valor médio por transação
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
