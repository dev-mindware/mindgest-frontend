import { Icon } from "@/components";
import { icons } from "lucide-react";
import { Role, PlanType } from "@/types";

type SubMenuItem = {
  name: string;
  url: string;
  roles?: Role[];
  minPlan?: PlanType;
};

export type MenuItem = {
  name: string;
  url: string;
  icon?: React.ReactNode;
  roles?: Role[];
  minPlan?: PlanType;
  showMoreIcon?: boolean;
  showUpgrade?: boolean;
  items?: SubMenuItem[];
};

export type MenuStructure = {
  menuItems: MenuItem[];
};

export const adminMenu: MenuItem[] = [
  {
    name: "Dashboard",
    url: "/admin/dashboard",
    icon: <Icon name="LayoutDashboard" />,
    roles: ["ADMIN"],
  },
  {
    name: "Empresas",
    url: "/admin/companies",
    icon: <Icon name="Building" />,
    roles: ["ADMIN"],
  },
  {
    name: "Planos & Billing",
    url: "/admin/plans",
    icon: <Icon name="Wallet" />,
    roles: ["ADMIN"],
  },
  {
    name: "Logs do Sistema",
    url: "/admin/logs",
    icon: <Icon name="FileSearch" />,
    roles: ["ADMIN"],
  },
  {
    name: "Configurações",
    url: "/settings",
    icon: <Icon name="Settings2" />,
    roles: ["ADMIN"],
    minPlan: "Base",
    items: [
      { name: "Geral", url: "/admin/settings/general" },
      { name: "Exportação", url: "/admin/settings/export" },
    ],
  },
];

export const menuItems: MenuStructure = {
  menuItems: [
    {
      name: "Dashboard",
      url: "/client/dashboard",
      icon: <Icon name="LayoutDashboard" />,
      roles: ["MANAGER", "OWNER", "SELLER"],
      minPlan: "Base",
    },
    {
      name: "GestIA",
      url: "/client/gestia",
      icon: <Icon name="Sparkles" className="h-5 w-5" />,
      roles: ["MANAGER", "OWNER", "SELLER"],
      minPlan: "Base",
      showUpgrade: true,
    },
    {
      name: "Documentos",
      url: "/client/documents",
      icon: <Icon name="ScrollText" />,
      roles: ["ADMIN", "MANAGER", "OWNER"],
      minPlan: "Base",
    },
    {
      name: "Items",
      url: "/client/items",
      icon: <Icon name="ShoppingBasket" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "Base",
    },
    {
      name: "Entidades",
      url: "/client/entities",
      icon: <Icon name="Users" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "Base",
    },
    {
      name: "Relatórios",
      url: "#",
      icon: <Icon name="ChartBar" />,
      roles: ["OWNER", "MANAGER"],
      minPlan: "Base",
      items: [
        {
          name: "Vendas simplificadas",
          url: "/client/reports/simple",
        },
        {
          name: "Vendas filtradas por data",
          url: "/client/reports/by-date",
          minPlan: "Tsunami",
        },
        {
          name: "Controle de Acesso",
          url: "/client/reports/access-control",
          minPlan: "Smart Pro",
        },
        {
          name: "Controle de Estoque",
          url: "/client/reports/stock-control",
          minPlan: "Smart Pro",
        },
      ],
    },
    {
      name: "Estoque",
      url: "/admin/stock",
      icon: <Icon name="Boxes" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "Tsunami",
    },
    {
      name: "POS",
      url: "/mindgest/pos",
      icon: <Icon name="Monitor" />,
      roles: ["CASHIER", "OWNER"],
      minPlan: "Tsunami",
      items: [
        { name: "Novo ponto de Venda", url: "/mindgest/pos/new" },
        { name: "Movimentos de Caixa", url: "/mindgest/pos/moviments-box" },
        {
          name: "Configurações",
          url: "/mindgest/pos/settings",
          roles: ["ADMIN"],
          minPlan: "Smart Pro",
        },
      ],
    },
    {
      name: "Aparência",
      url: "/admin/appearance",
      icon: <Icon name="Palette" />,
      roles: ["OWNER"],
      minPlan: "Tsunami",
    },
    {
      name: "Fornecedores & Lojas",
      url: "/admin/suppliers",
      icon: <Icon name="Store" />,
      roles: ["OWNER", "MANAGER"],
      minPlan: "Smart Pro",
    },
    {
      name: "GestAI",
      url: "/mindgest/gestai",
      icon: <Icon name="Bot" />,
      roles: ["OWNER", "MANAGER"],
      minPlan: "Smart Pro",
    },
    {
      name: "Análise de Estoque",
      url: "/admin/stock-analysis",
      icon: <Icon name="ChartPie" />,
      roles: ["OWNER", "MANAGER"],
      minPlan: "Smart Pro",
    },
    {
      name: "Gestão de POS",
      url: "/admin/pos-management",
      icon: <Icon name="SquareTerminal" />,
      roles: ["OWNER"],
      minPlan: "Smart Pro",
    },
  ],
};