import { buildDashboardOverviewMock } from "@/mocks/dashboard-overview";
import type { DashboardPeriodType } from "@/types";

const PERIODS: DashboardPeriodType[] = ["month", "quarter", "year"];

describe("buildDashboardOverviewMock", () => {
  it.each(PERIODS)("mantém os totais coerentes no período '%s'", (period) => {
    const overview = buildDashboardOverviewMock(period);

    // A facturação do card é sempre o último ponto do gráfico.
    const lastPoint =
      overview.financialEvolution.series[
        overview.financialEvolution.series.length - 1
      ];
    expect(overview.summaryCards.revenue.value).toBe(lastPoint.revenue);

    // Lucro = receita − despesas em todos os meses.
    overview.financialEvolution.series.forEach((point) => {
      expect(point.profit).toBe(point.revenue - point.expenses);
    });

    // A distribuição de vendas soma as vendas e a facturação do período.
    const { products, services, totalSales } = overview.salesDistribution;
    expect(products.count + services.count).toBe(totalSales);
    expect(products.percentage + services.percentage).toBe(100);
    expect(products.amount + services.amount).toBe(
      overview.summaryCards.revenue.value
    );
    expect(totalSales).toBe(overview.summaryCards.sales.value);

    // Os estados de stock somam o total do card de stock.
    const { normalStockItems, lowStockItems, outOfStockItems } =
      overview.stockOverview;
    expect(normalStockItems + lowStockItems + outOfStockItems).toBe(
      overview.summaryCards.stock.value
    );

    // Os baldes de contas a receber somam o total.
    const bucketsTotal = overview.accountsReceivable.buckets.reduce(
      (sum, bucket) => sum + bucket.amount,
      0
    );
    expect(bucketsTotal).toBe(overview.accountsReceivable.total);

    // A meta fecha: atingido + em falta = alvo.
    const { current, remaining, target } = overview.monthlyGoal;
    expect(current + remaining).toBe(target);
  });

  it("inclui a repartição por loja apenas no âmbito global", () => {
    expect(
      buildDashboardOverviewMock("month", { includeStores: true }).storesBreakdown
    ).toHaveLength(3);
    expect(
      buildDashboardOverviewMock("month").storesBreakdown
    ).toBeUndefined();
  });

  it("devolve 12 pontos no período anual e 6 nos restantes", () => {
    expect(buildDashboardOverviewMock("year").financialEvolution.series).toHaveLength(12);
    expect(buildDashboardOverviewMock("month").financialEvolution.series).toHaveLength(6);
    expect(buildDashboardOverviewMock("quarter").financialEvolution.series).toHaveLength(6);
  });

  it("data de actividade recente é sempre passada", () => {
    const now = new Date("2026-08-31T12:00:00");
    const overview = buildDashboardOverviewMock("month", { now });

    overview.recentActivity.forEach((item) => {
      expect(new Date(item.createdAt.replace(/Z$/, "")).getTime()).toBeLessThan(
        now.getTime()
      );
    });
  });
});
