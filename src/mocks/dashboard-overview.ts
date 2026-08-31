import type {
  DashboardOverview,
  DashboardPeriodType,
  FinancialEvolutionPoint,
} from "@/types";

/**
 * MOCK TEMPORÁRIO do endpoint `/reports/dashboard/overview`.
 *
 * Respeita exactamente o contrato acordado (`DashboardOverview`). Quando o
 * backend estiver pronto basta trocar a implementação de
 * `reportsService.getDashboardOverview` — nada mais muda.
 *
 * Os valores são coerentes entre si de propósito:
 * - `summaryCards.revenue.value` === último ponto de `financialEvolution`;
 * - `profit` === `revenue - expenses` em todos os meses;
 * - `salesDistribution` soma a facturação e as contagens somam `totalSales`;
 * - os estados de stock somam `summaryCards.stock.value`;
 * - os baldes de contas a receber somam o total.
 */

/** Série base (mês corrente = último ponto). Lucro = receita − despesas. */
const BASE_SERIES: FinancialEvolutionPoint[] = [
  { month: "Mar", revenue: 150_000, expenses: 60_000, profit: 90_000 },
  { month: "Abr", revenue: 220_000, expenses: 90_000, profit: 130_000 },
  { month: "Mai", revenue: 265_000, expenses: 110_000, profit: 155_000 },
  { month: "Jun", revenue: 300_000, expenses: 125_000, profit: 175_000 },
  { month: "Jul", revenue: 338_000, expenses: 143_000, profit: 195_000 },
  { month: "Ago", revenue: 400_000, expenses: 168_000, profit: 232_000 },
];

const EXTRA_SERIES: FinancialEvolutionPoint[] = [
  { month: "Set", revenue: 96_000, expenses: 41_000, profit: 55_000 },
  { month: "Out", revenue: 112_000, expenses: 48_000, profit: 64_000 },
  { month: "Nov", revenue: 128_000, expenses: 54_000, profit: 74_000 },
  { month: "Dez", revenue: 175_000, expenses: 72_000, profit: 103_000 },
  { month: "Jan", revenue: 118_000, expenses: 52_000, profit: 66_000 },
  { month: "Fev", revenue: 134_000, expenses: 58_000, profit: 76_000 },
];

const PERIOD_CONFIG: Record<
  DashboardPeriodType,
  { label: string; range: string; factor: number; months: number }
> = {
  month: { label: "Este mês", range: "last_6_months", factor: 1, months: 6 },
  quarter: {
    label: "Este trimestre",
    range: "last_6_months",
    factor: 2.8,
    months: 6,
  },
  year: { label: "Este ano", range: "last_12_months", factor: 9.4, months: 12 },
};

const round = (value: number, step = 100) => Math.round(value / step) * step;

function buildSeries(months: number): FinancialEvolutionPoint[] {
  if (months <= BASE_SERIES.length) return BASE_SERIES;
  return [...EXTRA_SERIES, ...BASE_SERIES].slice(-months);
}

function periodBounds(type: DashboardPeriodType, reference: Date) {
  const year = reference.getFullYear();
  const month = reference.getMonth();

  if (type === "year") {
    return { start: new Date(year, 0, 1), end: new Date(year, 11, 31) };
  }
  if (type === "quarter") {
    const firstMonth = Math.floor(month / 3) * 3;
    return {
      start: new Date(year, firstMonth, 1),
      end: new Date(year, firstMonth + 3, 0),
    };
  }
  return { start: new Date(year, month, 1), end: new Date(year, month + 1, 0) };
}

const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

/**
 * Minutos atrás → ISO, para a Actividade Recente ler sempre "Há X".
 * Emite wall-clock com sufixo `Z`, tal como o backend faz — é o formato que
 * `parseRawDate` espera, por isso o mock e a API real comportam-se igual.
 */
const minutesAgo = (minutes: number, reference: Date) => {
  const date = new Date(reference.getTime() - minutes * 60_000);
  const pad = (value: number) => String(value).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}Z`
  );
};

export function buildDashboardOverviewMock(
  periodType: DashboardPeriodType = "month",
  options: { includeStores?: boolean; now?: Date } = {}
): DashboardOverview {
  const { includeStores = false, now = new Date() } = options;
  const { label, range, factor, months } = PERIOD_CONFIG[periodType];
  const { start, end } = periodBounds(periodType, now);

  const series = buildSeries(months).map((point) => ({
    month: point.month,
    revenue: round(point.revenue * factor, 1_000),
    expenses: round(point.expenses * factor, 1_000),
    profit:
      round(point.revenue * factor, 1_000) - round(point.expenses * factor, 1_000),
  }));

  const current = series[series.length - 1];
  const previous = series[series.length - 2];

  // A facturação do período é sempre o último ponto da série — nunca divergem.
  const revenue = current.revenue;
  const revenueVariation =
    Math.round(((current.revenue - previous.revenue) / previous.revenue) * 1000) /
    10;

  const totalSales = Math.round(43 * factor);
  const productsCount = Math.round(totalSales * 0.32);
  const servicesCount = totalSales - productsCount;
  const productsPercentage = Math.round((productsCount / totalSales) * 100);
  const servicesPercentage = 100 - productsPercentage;
  const productsAmount = round(revenue * (productsPercentage / 100), 100);

  const normalStockItems = Math.round(228 * factor);
  const lowStockItems = Math.round(12 * factor);
  const outOfStockItems = Math.round(5 * factor);
  const stockItems = normalStockItems + lowStockItems + outOfStockItems;

  const totalClients = Math.round(128 * (periodType === "month" ? 1 : factor * 0.6));

  const overdue = round(32_000 * factor, 100);
  const dueIn7Days = round(43_000 * factor, 100);
  const dueIn30Days = round(10_000 * factor, 100);
  const receivableTotal = overdue + dueIn7Days + dueIn30Days;
  const receivablePercentage = (amount: number) =>
    Math.round((amount / receivableTotal) * 100);

  const goalTarget = round(500_000 * factor, 1_000);
  const goalCurrent = round(412_000 * factor, 1_000);

  return {
    title: "Visão Geral",
    period: {
      type: periodType,
      label,
      startDate: toIsoDate(start),
      endDate: toIsoDate(end),
    },
    summaryCards: {
      revenue: {
        label: "Facturação",
        value: revenue,
        variationPercent: revenueVariation,
        currency: "Kz",
      },
      sales: { label: "Vendas", value: totalSales, variationPercent: 12.5 },
      clients: { label: "Clientes", value: totalClients, variationPercent: 14.3 },
      stock: { label: "Stock", value: stockItems, variationPercent: 6.7 },
    },
    financialEvolution: {
      label: "Evolução Financeira",
      range,
      series,
    },
    salesDistribution: {
      label: "Vendas por Tipo",
      totalSales,
      products: {
        count: productsCount,
        percentage: productsPercentage,
        amount: productsAmount,
        currency: "Kz",
      },
      services: {
        count: servicesCount,
        percentage: servicesPercentage,
        amount: revenue - productsAmount,
        currency: "Kz",
      },
    },
    clientsOverview: {
      totalClients,
      newClientsThisMonth: Math.round(14 * factor),
      newClientsVariationPercent: 16,
      recurringClientsPercentage: 76,
      clientsWithDebt: Math.round(14 * factor),
      clientsWithDebtVariationPercent: 12,
    },
    accountsReceivable: {
      total: receivableTotal,
      currency: "Kz",
      buckets: [
        {
          key: "overdue",
          label: "Vencido",
          amount: overdue,
          percentage: receivablePercentage(overdue),
        },
        {
          key: "due_7_days",
          label: "Vence em 7 dias",
          amount: dueIn7Days,
          percentage: receivablePercentage(dueIn7Days),
        },
        {
          key: "due_30_days",
          label: "Vence em 30 dias",
          amount: dueIn30Days,
          percentage: receivablePercentage(dueIn30Days),
        },
      ],
    },
    stockOverview: {
      stockValue: round(1_250_000 * factor, 1_000),
      currency: "Kz",
      normalStockItems,
      lowStockItems,
      outOfStockItems,
    },
    recentActivity: [
      {
        id: "act-1",
        type: "invoice_created",
        title: "Factura FT 00234 criada para Cliente ABC",
        reference: "FT 00234",
        amount: 45_000,
        currency: "Kz",
        createdAt: minutesAgo(120, now),
      },
      {
        id: "act-2",
        type: "payment_received",
        title: "Pagamento recebido de Cliente XYZ",
        amount: 25_000,
        currency: "Kz",
        createdAt: minutesAgo(240, now),
      },
      {
        id: "act-3",
        type: "product_added",
        title: "Produto adicionado: Monitor Samsung 24",
        amount: null,
        currency: null,
        createdAt: minutesAgo(360, now),
      },
      {
        id: "act-4",
        type: "client_added",
        title: "Novo cliente registado: Sonangol Distribuidora",
        amount: null,
        currency: null,
        createdAt: minutesAgo(600, now),
      },
      {
        id: "act-5",
        type: "stock_adjusted",
        title: "Stock ajustado: Teclado Logitech K380 (+30 un.)",
        amount: null,
        currency: null,
        createdAt: minutesAgo(1_020, now),
      },
    ],
    monthlyGoal: {
      target: goalTarget,
      current: goalCurrent,
      percentage: Math.round((goalCurrent / goalTarget) * 100),
      remaining: goalTarget - goalCurrent,
      currency: "Kz",
    },
    ...(includeStores
      ? {
          storesBreakdown: [
            {
              storeId: "store-1",
              storeName: "Loja Central — Talatona",
              totalSales: round(revenue * 0.46, 1_000),
              productsSold: Math.round(productsCount * 0.5),
              servicesRendered: Math.round(servicesCount * 0.45),
            },
            {
              storeId: "store-2",
              storeName: "Loja Maianga",
              totalSales: round(revenue * 0.33, 1_000),
              productsSold: Math.round(productsCount * 0.3),
              servicesRendered: Math.round(servicesCount * 0.35),
            },
            {
              storeId: "store-3",
              storeName: "Loja Benfica",
              totalSales: round(revenue * 0.21, 1_000),
              productsSold: Math.round(productsCount * 0.2),
              servicesRendered: Math.round(servicesCount * 0.2),
            },
          ],
        }
      : {}),
  };
}
