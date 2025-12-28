"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Skeleton,
  Icon,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  EmptyState,
  RequestError,
} from "@/components";
import { useStockSummary } from "@/hooks/stock";
import { formatCurrency, formatDateTime } from "@/utils";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { icons } from "lucide-react";
import { DynamicMetricCard, DynamicMetricCardSkeleton } from "@/components/shared/dynamic-metric-card";

export function StockSummaryCharts() {
  const { summary, isLoading, isError, refetch } = useStockSummary();

  if (isError) {
    return (
      <RequestError
        refetch={refetch}
        message="Erro ao carregar o resumo do estoque"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <DynamicMetricCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!summary || summary.totalItems === 0) {
    return (
      <EmptyState
        title="Resumo Indisponível"
        description="Não há dados de estoque suficientes para gerar um resumo."
        icon="ChartColumn"
      />
    );
  }

  const chartData = [
    {
      outPercentage: summary.outOfStockPercentage,
      lowPercentage: summary.lowStockPercentage,
      adequate: summary.adequateStockCount,
    },
  ];

  const chartConfig = {
    adequate: { label: "Adequado", color: "var(--primary)" },
    lowPercentage: { label: "Estoque Baixo", color: "var(--chart-2)" },
    outPercentage: { label: "Fora de Estoque", color: "var(--destructive)" },
  };

  const stats: {
    title: string;
    value: number;
    icon: keyof typeof icons;
    description: string;
  }[] = [
    {
      title: "Total de Itens",
      value: summary.totalItems,
      icon: "Package",
      description: "Tipos de produtos cadastrados",
    },
    {
      title: "Unidades Totais",
      value: summary.totalUnits,
      icon: "Boxes",
      description: "Soma de todas as quantidades",
    },
    {
      title: "Disponível",
      value: summary.totalAvailable,
      icon: "CircleCheck",
      description: "Pronto para venda",
    },
    {
      title: "Reservado",
      value: summary.totalReserved,
      icon: "Lock",
      description: "Em pedidos ou reservas",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <DynamicMetricCard
            key={idx}
            title={stat.value}
            subtitle={stat.title}
            description={stat.description}
            icon={stat.icon}
            variant={"default"}
            className="flex-1"
          />
        ))}
      </div>

      {/* Chart Area */}
      {isLoading ? (
        <Card className="border-muted-foreground/10 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div className="space-y-2">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="space-y-2 flex flex-col items-end">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-muted-foreground/10 shadow-none overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold">
                Estatística Mensal de Estoque
              </CardTitle>
              <CardDescription>
                Distribuição mensal dos níveis de inventário por categoria
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorAdequate"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--destructive)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--destructive)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-muted-foreground/10"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  className="text-[10px] font-bold uppercase tracking-widest fill-muted-foreground"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      formatter={(value, name) => {
                        const label =
                          chartConfig[name as keyof typeof chartConfig]
                            ?.label || name;
                        return (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              {label}:
                            </span>
                            <span className="font-semibold text-foreground">
                              {value}
                              {name === "adequate" ? " itens" : "%"}
                            </span>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="adequate"
                  stroke="var(--primary)"
                  fillOpacity={1}
                  fill="url(#colorAdequate)"
                  strokeWidth={2}
                  stackId="1"
                />
                <Area
                  type="monotone"
                  dataKey="lowPercentage"
                  stroke="var(--chart-2)"
                  fillOpacity={1}
                  fill="url(#colorLow)"
                  strokeWidth={2}
                  stackId="1"
                />
                <Area
                  type="monotone"
                  dataKey="outPercentage"
                  stroke="var(--destructive)"
                  fillOpacity={1}
                  fill="url(#colorOut)"
                  strokeWidth={2}
                  stackId="1"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
