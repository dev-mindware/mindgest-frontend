"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatCurrency } from "@/utils";
import { ClientAnalyticsResponse } from "@/types";
import { EmptyState } from "@/components/common";
import { DynamicMetricCard } from "@/components/shared/dynamic-metric-card";

interface MetricsPieChartProps {
    summary: ClientAnalyticsResponse["summary"];
}

export function MetricsPieChart({ summary }: MetricsPieChartProps) {
    const pieChartData = [
        { name: "Receita Total", value: summary.totalRevenue, color: "#b899ff" },
        { name: "Ticket Médio", value: summary.averageTicket, color: "#9956f6" },
        { name: "Clientes", value: summary.totalClients * 1000000, color: "#7c3aed" },
        { name: "Score Fidelização", value: summary.averageLoyaltyScore * 100000, color: "#5b21b6" },
    ];

    return (
        <Card className="col-span-2">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <CardTitle>Distribuição de Métricas</CardTitle>
                </div>
                <CardDescription>Visão geral das principais métricas</CardDescription>
            </CardHeader>
            <CardContent>
                {summary.totalRevenue === 0 && summary.totalClients === 0 ? (
                    <EmptyState
                        icon="ChartPie"
                        title="Sem dados para exibir"
                        description="Não foram encontradas métricas para o período selecionado."
                    />
                ) : (
                    <>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => entry.name}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                            <DynamicMetricCard
                                title={formatCurrency(summary.totalRevenue)}
                                subtitle="Receita Total"
                                icon="DollarSign"
                                className="border-none shadow-none bg-primary/5"
                            />
                            <DynamicMetricCard
                                title={formatCurrency(summary.averageTicket)}
                                subtitle="Ticket Médio"
                                icon="Receipt"
                                className="border-none shadow-none bg-primary/5"
                            />
                            <DynamicMetricCard
                                title={summary.totalClients}
                                subtitle="Total Clientes"
                                icon="Users"
                                className="border-none shadow-none bg-primary/5"
                            />
                            <DynamicMetricCard
                                title={summary.averageLoyaltyScore}
                                subtitle="Score Médio"
                                icon="Award"
                                className="border-none shadow-none bg-primary/5"
                            />
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
