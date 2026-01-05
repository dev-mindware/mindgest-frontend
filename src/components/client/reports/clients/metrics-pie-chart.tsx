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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Receita Total</p>
                        <p className="text-lg font-bold text-primary-300">
                            {formatCurrency(summary.totalRevenue)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Ticket Médio</p>
                        <p className="text-lg font-bold text-primary-500">
                            {formatCurrency(summary.averageTicket)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Total Clientes</p>
                        <p className="text-lg font-bold text-primary-700">
                            {summary.totalClients}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Score Médio</p>
                        <p className="text-lg font-bold text-primary-900">
                            {summary.averageLoyaltyScore}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
