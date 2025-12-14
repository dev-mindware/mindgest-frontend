import { TrendingUp, TrendingDown } from "lucide-react"
import { StatCard } from "./stat-card"

const stats = [
  {
    label: "Produtos Vendidos",
    value: "450",
    trend: "-20 este mês",
    trendIcon: TrendingDown,
    trendPositive: false,
    footerMain: "Queda pontual no volume",
    footerSub: "Sugere ajustes nas campanhas",
  },
  {
    label: "Serviços Prestados",
    value: "678",
    trend: "+5.2%",
    trendIcon: TrendingUp,
    trendPositive: true,
    footerMain: "Crescimento consistente",
    footerSub: "Alta procura nos últimos dias",
  },
  {
    label: "Total de Vendas",
    value: "80,912 Kz",
    trend: "-1.2%",
    trendIcon: TrendingDown,
    trendPositive: false,
    footerMain: "Pequena retração no período",
    footerSub: "Reforçar ações comerciais",
  },
  {
    label: "Total Geral",
    value: "250,040 Kz",
    trend: "+7.8%",
    trendIcon: TrendingUp,
    trendPositive: true,
    footerMain: "Base financeira em expansão",
    footerSub: "Superando metas estabelecidas",
  },
];


export function DashboardAnalisys() {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  )
}
