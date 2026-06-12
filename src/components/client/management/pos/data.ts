import { icons } from "lucide-react";

export interface SummaryCard {
  title: string;
  value?: number | string;
  type: "default" | "action" | "interactive";
  icon: keyof typeof icons;
  description: string;
  modalId?: string;
  color?: string;
}

export const summaryCards: SummaryCard[] = [
  {
    title: "Receitas",
    value: 121000,
    type: "default",
    icon: "TrendingUp",
    description: "Receitas totais do dia",
  },
  {
    title: "Despesas",
    value: 13100,
    type: "default",
    icon: "TrendingDown",
    description: "Despesas totais do dia",
  },
  {
    title: "Pedidos",
    value: 3,
    type: "interactive",
    modalId: "pos-requests",
    icon: "Bell",
    description: "Consultar pedidos pendentes",
  },
  {
    title: "Gerir caixas",
    type: "action",
    modalId: "opening-cashier",
    icon: "Info",
    description: "Seleccione para gerir as sessões",
  },
];
