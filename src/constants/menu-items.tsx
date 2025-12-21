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
  items: MenuItem[];
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
    name: "Planos",
    url: "/admin/plans",
    icon: <Icon name="Wallet" />,
    roles: ["ADMIN"],
  },
  {
    name: "Categorias",
    url: "/admin/categories",
    icon: <Icon name="Tag" />,
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
  items: [
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
      icon: <Icon name="Sparkles" className="w-5 h-5" />,
      roles: ["MANAGER", "OWNER", "SELLER"],
      minPlan: "Base",
      showUpgrade: true,
    },
    {
      name: "Planos",
      url: "/client/plans",
      icon: <Icon name="Wallet" className="w-5 h-5" />,
      roles: ["MANAGER", "OWNER", "SELLER"],
      minPlan: "Base",
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
      url: "/client/items", //?tab=product
      icon: <Icon name="ShoppingBasket" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "Base",
    },
    {
      name: "Gestão",
      url: "#",
      icon: <Icon name="Waypoints" />,
      roles: ["OWNER", "MANAGER"],
      minPlan: "Base",
      items: [
        {
          name: "POS",
          url: "/client/management/pos",
        },
        {
          name: "Stock",
          url: "/client/management/stock",
        },
      ],
    },
    {
      name: "Relatórios",
      url: "#",
      icon: <Icon name="ChartBar" />,
      roles: ["OWNER", "MANAGER"],
      minPlan: "Base",
      items: [
        {
          name: "Vendas",
          url: "/client/reports/sales",
        },
        {
          name: "Clientes",
          url: "/client/reports/clients",
          // minPlan: "Tsunami",
        },
        {
          name: "Controle de Acesso",
          url: "/client/reports/access-control",
          minPlan: "Smart Pro",
        },
      ],
    },
    {
      name: "Notificações",
      url: "/client/notifications",
      icon: <Icon name="Bell" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "Base",
    },
    {
      name: "Configurações",
      url: "/client/settings",
      icon: <Icon name="Settings" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "Base",
    },
    {
      name: "Aparência",
      url: "/client/appearance",
      icon: <Icon name="Palette" />,
      roles: ["OWNER", "MANAGER"],
      minPlan: "Tsunami",
    },
    {
      name: "Fornecedores & Lojas",
      url: "/client/suppliers",
      icon: <Icon name="Store" />,
      roles: ["OWNER", "MANAGER"],
      minPlan: "Smart Pro",
    },
    {
      name: "GestAI",
      url: "/client/gestai",
      icon: <Icon name="Bot" />,
      roles: ["OWNER", "MANAGER"],
      minPlan: "Smart Pro",
    },
    {
      name: "Análise de Estoque",
      url: "/client/stock-analysis",
      icon: <Icon name="ChartPie" />,
      roles: ["OWNER", "MANAGER"],
      minPlan: "Smart Pro",
    },
    {
      name: "Gestão de POS",
      url: "/client/pos-management",
      icon: <Icon name="SquareTerminal" />,
      roles: ["OWNER"],
      minPlan: "Smart Pro",
    },
  ],
};
