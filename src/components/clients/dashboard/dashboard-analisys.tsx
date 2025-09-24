import { Stats } from "@/types";
import { CardStat } from "./stat-card";
import { formatCurrency } from "@/utils";

const metrics: Stats[] = [
  {
    title: "Total de Lucro",
    value: `${formatCurrency(1200)}`,
    icon: "CreditCard",
    description: "Valor total já levantado",
  },
  {
    title: "Comissões Totais",
    value: `${formatCurrency(15000)}`,
    icon: "DollarSign",
    description: "Todas as comissões acumuladas",
  },
  {
    title: "Produtos e Serviços",
    value: "45",
    icon: "ShoppingCart",
    description: "Número total de vendas",
  },
  {
    title: "Usuários",
    value: "3",
    icon: "Users",
    description: "Usuários cadastrados pelo seu link",
  },
];

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((stat, index) => {
        return <CardStat key={index} stat={stat} />;
      })}
    </div>
  );
}