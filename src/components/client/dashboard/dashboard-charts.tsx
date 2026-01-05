"use client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Pie,
  PieChart,
  Cell,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
} from "@/components";

const salesByMonth = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 25000 },
  { month: "Apr", revenue: 20000 },
  { month: "May", revenue: 30000 },
  { month: "Jun", revenue: 28000 },
];

const salesByCategory = [
  { name: "Produtos", value: 45000 },
  { name: "Serviços", value: 25000 },
  { name: "Outros", value: 5000 },
];

const chartConfig = {
  revenue: { label: "Faturação", color: "#9956f6" },
} satisfies ChartConfig;

const pieColors = [
  "#9956f6", // roxo
  "#2563eb", // azul
  "#16a34a", // verde
  "#ca8a04", // amarelo
];

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="shadow-none border col-span-2">
        <CardHeader>
          <CardTitle>Evolução da Faturação</CardTitle>
          <CardDescription>Receitas mensais registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="h-[320px] w-full p-0 m-0"
          >
            <AreaChart
              data={salesByMonth}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value: number) => `${value.toLocaleString()} Kz`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                fill="var(--color-revenue)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-none border">
        <CardHeader>
          <CardTitle>Distribuição de Vendas</CardTitle>
          <CardDescription>Produtos vs Serviços</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="h-[320px] w-full flex items-center justify-center"
          >
            <PieChart width={400} height={300}>
              <Pie
                data={salesByCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60} // <<< 🔹 transforma em donut
                outerRadius={100} // raio externo
                paddingAngle={4} // espaço entre fatias
                label={({ name, value }) =>
                  `${name}: ${value.toLocaleString()} Kz`
                }
              >
                {salesByCategory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value.toLocaleString()} Kz`}
              />
              <Legend />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
