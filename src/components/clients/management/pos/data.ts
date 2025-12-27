export interface Cashier {
  id: string;
  name: string;
  user: string;
  status: string;
  totalSold: number;
  activityTime: string;
  progress: number;
}

export interface OpeningRequest {
  id: number;
  message: string;
  time: string;
}

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
    title: "Solicitações",
    value: 3,
    type: "interactive",
    modalId: "pos-requests",
    icon: "Bell",
    description: "Clique para ver as solicitações",
  },
  {
    title: "Gerenciar Caixas",
    type: "action",
    modalId: "opening-cashier",
    icon: "Info",
    description: "Clique para gerenciar as sessões",
  },
];

export const cashiers: Cashier[] = [
  {
    id: "1",
    name: "Caixa n° 02",
    user: "João Afonso Raimundo",
    status: "Ativo",
    totalSold: 3800000,
    activityTime: "05:52",
    progress: 45,
  },
  {
    id: "2",
    name: "Caixa n° 02",
    user: "João Afonso Raimundo",
    status: "Ativo",
    totalSold: 3800000,
    activityTime: "05:52",
    progress: 60,
  },
  {
    id: "3",
    name: "Caixa n° 02",
    user: "João Afonso Raimundo",
    status: "Ativo",
    totalSold: 3800000,
    activityTime: "05:52",
    progress: 30,
  },
  {
    id: "4",
    name: "Caixa n° 02",
    user: "João Afonso Raimundo",
    status: "Ativo",
    totalSold: 3800000,
    activityTime: "05:52",
    progress: 80,
  },
  {
    id: "5",
    name: "Caixa n° 02",
    user: "João Afonso Raimundo",
    status: "Ativo",
    totalSold: 3800000,
    activityTime: "05:52",
    progress: 50,
  },
  {
    id: "6",
    name: "Caixa n° 02",
    user: "João Afonso Raimundo",
    status: "Ativo",
    totalSold: 3800000,
    activityTime: "05:52",
    progress: 40,
  },
];

export const openingRequests: OpeningRequest[] = [
  {
    id: 1,
    message:
      "O Caixa n°04 solicitou abertura de caixa para começar com as atividades",
    time: "2 min",
  },
  {
    id: 2,
    message:
      "O Caixa n°03 solicitou abertura de caixa para começar com as atividades",
    time: "10 min",
  },
  {
    id: 3,
    message:
      "O Caixa n°02 solicitou abertura de caixa para começar com as atividades",
    time: "12 min",
  },
];

export const stores = [
  { label: "Loja Principal", value: "store-1" },
  { label: "Filial Benfica", value: "store-2" },
  { label: "Quiosque Shopping", value: "store-3" },
];

export const availableCashiers = [
  { id: "101", name: "Caixa n° 01", status: "Disponível" },
  { id: "102", name: "Caixa n° 02", status: "Disponível" },
  { id: "103", name: "Caixa n° 03", status: "Disponível" },
  { id: "104", name: "Caixa n° 04", status: "Disponível" },
  { id: "105", name: "Caixa n° 05", status: "Disponível" },
];
