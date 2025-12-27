"use client";

import { TitleList, RequestError } from "@/components/common";
import { Skeleton } from "@/components/ui/skeleton";
import { SalesAreaChart } from "./sales-area-chart";
import { SalesSummaryCards } from "./sales-summary-cards";
import { SaftExportCard } from "./saft-export-card";
import { ReportFilters } from "../common";
import { useSalesReports } from "@/hooks/reports";
import { SalesPeriod } from "@/types/reports";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DynamicMetricCardSkeleton } from "@/components";

function SalesSkeleton() {
    return (
        <div className="space-y-6">
            <TitleList
                title="Relatórios de Vendas"
                suTitle="Análise de Vendas por Período"
            />

            {/* Filters Skeleton */}
            <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Metrics & SAFT Grid Skeleton */}
            <div className="grid gap-4 md:grid-cols-4">
                {/* Metrics Cards */}
                <div className="md:col-span-3 grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <DynamicMetricCardSkeleton key={i} />
                    ))}
                </div>

                {/* SAFT Card Skeleton */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-10" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-10" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>

            {/* Chart Skeleton */}
            <div className="border rounded-lg bg-card">
                <div className="p-6 border-b">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="p-6">
                    <div className="flex items-end gap-2 h-[400px] w-full pt-4">
                        {[...Array(12)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="w-full"
                                style={{
                                    height: `${Math.random() * 60 + 20}%`,
                                    opacity: 0.1 + (i / 20)
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SalesReportsContent() {
    const {
        data,
        isLoading,
        isError,
        refetch,
        period,
        setPeriod,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
    } = useSalesReports();

    if (isLoading) {
        return <SalesSkeleton />;
    }

    if (isError || !data) {
        return (
            <div className="space-y-6">
                <TitleList
                    title="Relatórios de Vendas"
                    suTitle="Análise de Vendas por Período"
                />
                <RequestError refetch={refetch} message="Erro ao carregar relatórios de vendas" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <TitleList
                title="Dashboard de Vendas"
                suTitle="Analise receitas, volume e evolução por período de forma clara."
            />

            <ReportFilters
                filters={[
                    {
                        type: "select",
                        label: "Período",
                        value: period,
                        onChange: (value) => setPeriod(value as SalesPeriod),
                        options: [
                            { value: "daily", label: "Diário" },
                            { value: "weekly", label: "Semanal" },
                            { value: "monthly", label: "Mensal" },
                            { value: "quarterly", label: "Trimestral" },
                            { value: "yearly", label: "Anual" },
                        ],
                        placeholder: "Selecione o período",
                    },
                    {
                        type: "date",
                        label: "Data Início",
                        value: startDate,
                        onChange: setStartDate,
                    },
                    {
                        type: "date",
                        label: "Data Fim",
                        value: endDate,
                        onChange: setEndDate,
                        disabledDates: (date) => (startDate ? date < startDate : false),
                    },
                ]}
            />

            <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-3">
                    <SalesSummaryCards summary={data.summary} />
                </div>
                <SaftExportCard />
            </div>

            <SalesAreaChart
                data={data.data}
                period={period}
            />
        </div>
    );
}