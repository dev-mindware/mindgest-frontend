import { PlanType } from "@/types";

export type PlanBenefit = {
  icon: string;
  title: string;
  description: string;
};

export type PlanFeatureGroup = {
  features: string[];
};

export const mindMessageLimitByPlan: Record<PlanType, number> = {
  Base: 10,
  Smart: 15,
  Pro: 20,
};

export const includedInAllPlans: PlanBenefit[] = [
  {
    icon: "MonitorSmartphone",
    title: "Multiplataforma",
    description:
      "Acesso web responsivo para desktop, tablet e telemóvel, sem instalação obrigatória.",
  },
  {
    icon: "FileText",
    title: "Documentos ilimitados",
    description:
      "Emita faturas, recibos, pró-formas e notas de crédito sem limite comercial por plano.",
  },
  {
    icon: "Users",
    title: "Gestão de Clientes",
    description:
      "Organize clientes, contactos e dados fiscais para faturação e acompanhamento.",
  },
  {
    icon: "Package",
    title: "Produtos e serviços",
    description:
      "Cadastre produtos, serviços, categorias, preços e impostos numa base única.",
  },
];

export const planFeatureMatrix: Record<PlanType, PlanFeatureGroup> = {
  Base: {
    features: [
      "Categorias de Itens",
      "Bancos e Configurações Fiscais",
      "Relatórios Básicos de Vendas",
      "Acesso Web Multiplataforma",
      "Gestão de Clientes",
      "Gestão de Produtos e Serviços",
      "Assistente MIND - 10 mensagens",
    ]
  },
  Smart: {
    features: [
      "Tudo do plano Base",
      "Movimentos de Caixa",
      "Configurações POS do operador",
      "Controle de Estoque",
      "Cadastro de Produtos com Código de Barras",
      "Relatórios de Clientes",
      "Personalização de Aparência",
      "Assistente MIND - 15 mensagens",
    ],
  },
  Pro: {
    features: [
      "Tudo do plano Smart",
      "Gestão de Reservas de Estoque",
      "Gestão Avançada de POS",
      "Controle Robusto de Produtos",
      "Relatórios avançados",
      "Relatórios de Acesso e Auditoria",
      "Gestão Completa para Operações Multi-loja",
      "Assistente MIND - 20 mensagens",
    ],
  },
};

export function getPlanFeatureGroups(planType: PlanType): PlanFeatureGroup {
  const base = planFeatureMatrix.Base;

  if (planType === "Base") {
    return base;
  }

  if (planType === "Smart") {
    return planFeatureMatrix.Smart;
  }

  return planFeatureMatrix.Pro;
}
