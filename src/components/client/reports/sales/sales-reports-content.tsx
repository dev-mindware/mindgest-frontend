"use client";
import { TitleList, RequestError, SalesSkeleton } from "@/components/common";
import { SalesAreaChart } from "./sales-area-chart";
import { SalesSummaryCards } from "./sales-summary-cards";

import { ReportExportButton, ReportFilters } from "../common";
import { useSalesReports } from "@/hooks/reports";
import { SalesPeriod } from "@/types/reports";
import { RequestSalesError } from "./request-sales-error";

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

  if (isLoading) return <SalesSkeleton />;

  if (isError || !data) 
    return <RequestSalesError refetch={refetch} />;

  return (
    <div className="space-y-6">
      <div data-tour="reports-sales-header">
        <TitleList
          title="Relatórios de Vendas"
          suTitle="Analise receitas, volume e evolução por período de forma clara."
        />
      </div>

      <div data-tour="reports-sales-filters">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
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
                placeholder: "Seleccione o período",
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
          <div data-tour="reports-sales-export">
            <ReportExportButton
              reportType="SALES"
              startDate={startDate}
              endDate={endDate}
              filenamePrefix="relatorio-vendas"
              className="w-full lg:w-auto"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <SalesSummaryCards summary={data.summary} />
        <SalesAreaChart data={data.data} period={period} />
      </div>
    </div>
  );
}
