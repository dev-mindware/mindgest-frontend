// components/StatsGrid.tsx
import { TrendingUp, TrendingDown } from "lucide-react"
import { StatCard } from "./stat-card"

const stats = [
  {
    label: "Total de Termos",
    value: "2,450",
    trend: "-20 este mês",
    trendIcon: TrendingDown,
    trendPositive: false,
    footerMain: "Crescimento constante",
    footerSub: "Base lexical em expansão",
  },
  {
    label: "Topónimos Cadastrados",
    value: "3,678",
    trend: "+5.2%",
    trendIcon: TrendingUp,
    trendPositive: true,
    footerMain: "Cobertura geográfica a aumentar",
    footerSub: "Mais localidades mapeadas",
  },
  {
    label: "Antropónimos Recolhidos",
    value: "8,912",
    trend: "-1.2%",
    trendIcon: TrendingDown,
    trendPositive: false,
    footerMain: "Pequena queda na recolha",
    footerSub: "Precisa reforço de pesquisa",
  },
  {
    label: "Total de Entradas",
    value: "25,040",
    trend: "+7.8%",
    trendIcon: TrendingUp,
    trendPositive: true,
    footerMain: "Base geral em expansão",
    footerSub: "Atingindo as metas do projeto",
  },
]

export function DashboardAnalisys() {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  )
}
