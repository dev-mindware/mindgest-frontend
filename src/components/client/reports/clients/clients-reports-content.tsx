"use client";

import { TitleList, RequestError } from "@/components/common";
import { useClientAnalytics } from "@/hooks/reports/use-client-analytics";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { ReportFilters } from "../common";
import { MetricsPieChart } from "./metrics-pie-chart";
import { TopClientCard } from "./top-client-card";
import { MonthlyRevenueTable } from "./monthly-revenue-table";
import { PreferredProductsTable } from "./preferred-products-table";

export function ClientsReportsContent() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    reportType,
    setReportType,
    limit,
    setLimit,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useClientAnalytics();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <TitleList
          title="Relatórios de Clientes"
          suTitle="Análise de Clientes"
        />
        <RequestError
          refetch={refetch}
          message="Erro ao carregar relatórios de clientes"
        />
      </div>
    );
  }

  const topClient = data.clients[0];

  return (
    <div className="space-y-6">
      <TitleList
        title="Dashboard de Clientes"
        suTitle="Acompanhe compras, frequência e valor médio para identificar quem gera mais receita."
      />

      <ReportFilters
        filters={[
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
          {
            type: "select",
            label: "Tipo de Cliente",
            value: reportType,
            onChange: setReportType,
            options: [
              { value: "top", label: "Top Clientes" },
              { value: "recent", label: "Recentes" },
              { value: "inactive", label: "Inativos" },
            ],
            placeholder: "Selecione o tipo",
          },
          {
            type: "select",
            label: "Limite",
            value: limit,
            onChange: setLimit,
            options: [
              { value: "5", label: "5" },
              { value: "10", label: "10" },
              { value: "20", label: "20" },
            ],
            placeholder: "Selecione o limite",
          },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricsPieChart summary={data.summary} />
        <TopClientCard client={topClient} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyRevenueTable monthlyTrend={topClient?.monthlyTrend || []} />
        <PreferredProductsTable
          preferredItems={topClient?.preferredItems || []}
        />
      </div>
    </div>
  );
}
