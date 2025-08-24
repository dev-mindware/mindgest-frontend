import { Icon } from "@/components";
import { icons } from "lucide-react";
import { Role, Plan } from "@/types";

type SubMenuItem = {
  name: string;
  url: string;
  roles?: Role[];
  minPlan?: Plan;
};

export type MenuItem = {
  name: string;
  url: string;
  icon?: React.ReactNode;
  roles?: Role[];
  minPlan?: Plan;
  showMoreIcon?: boolean;
  showUpgrade?: boolean;
  items?: SubMenuItem[];
};

type Team = {
  name: string;
  logo: keyof typeof icons;
  plan: string;
};

export type MenuStructure = {
  teams: Team[];
  menuItems: MenuItem[];
};

export const adminMenu: MenuItem[] = [
  {
    name: "Dashboard Global",
    url: "/super/dashboard",
    icon: <Icon name="Globe" />,
    roles: ["ADMIN"],
  },
  {
    name: "Empresas",
    url: "/super/companies",
    icon: <Icon name="Building" />,
    roles: ["ADMIN"],
  },
  {
    name: "Planos & Billing",
    url: "/super/plans",
    icon: <Icon name="Wallet" />,
    roles: ["ADMIN"],
  },
  {
    name: "Logs do Sistema",
    url: "/super/logs",
    icon: <Icon name="FileSearch" />,
    roles: ["ADMIN"],
  },
  {
    name: "Configurações",
    url: "/settings",
    icon: <Icon name="Settings2" />,
    roles: ["ADMIN"],
    minPlan: "BASE",
    items: [
      { name: "Geral", url: "/settings/general" },
      { name: "Exportação", url: "/settings/export" },
    ],
  },
];

export const menuItems: MenuStructure = {
  teams: [
    { name: "Mindware, Lda", logo: "GalleryVerticalEnd", plan: "Empresa" },
    { name: "Mindware Studio", logo: "AudioWaveform", plan: "Startup" },
    { name: "MindSchool", logo: "University", plan: "Free" },
  ],
  menuItems: [
    {
      name: "Dashboard",
      url: "/client/dashboard",
      icon: <Icon name="LayoutDashboard" />,
      roles: ["MANAGER", "OWNER", "SELLER"],
      minPlan: "BASE",
    },
    {
      name: "GestIA",
      url: "/client/gestia",
      icon: <Icon name="Sparkles" />,
      roles: ["MANAGER", "OWNER", "SELLER"],
      minPlan: "BASE",
      showUpgrade: true,
    },
    {
      name: "Documentos",
      url: "/client/documents",
      icon: <Icon name="ScrollText" />,
      roles: ["ADMIN", "MANAGER", "OWNER"],
      minPlan: "BASE",
    },
    {
      name: "Items",
      url: "/client/items",
      icon: <Icon name="ShoppingBasket" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "BASE",
    },
    {
      name: "Entidades",
      url: "/client/entities",
      icon: <Icon name="Users" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "BASE",
    },
    {
      name: "Relatórios",
      url: "#",
      icon: <Icon name="ChartBar" />,
      roles: ["OWNER", "MANAGER"],
      minPlan: "BASE",
      items: [
        {
          name: "Vendas simplificadas",
          url: "/client/reports/simple",
        },
        {
          name: "Vendas filtradas por data",
          url: "/client/reports/by-date",
          minPlan: "TSUNAMI",
        },
        {
          name: "Controle de Acesso",
          url: "/client/reports/access-control",
          minPlan: "SMART_PRO",
        },
        {
          name: "Controle de Estoque",
          url: "/client/reports/stock-control",
          minPlan: "SMART_PRO",
        },
      ],
    },

    // TSUNAMI+
    {
      name: "Estoque",
      url: "/admin/stock",
      icon: <Icon name="Boxes" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "TSUNAMI",
    },
    {
      name: "POS",
      url: "/mindgest/pos",
      icon: <Icon name="Monitor" />,
      roles: ["CASHIER", "OWNER"],
      minPlan: "TSUNAMI",
      items: [
        { name: "Novo ponto de Venda", url: "/mindgest/pos/new" },
        { name: "Movimentos de Caixa", url: "/mindgest/pos/moviments-box" },
        {
          name: "Configurações",
          url: "/mindgest/pos/settings",
          roles: ["ADMIN"],
          minPlan: "SMART_PRO",
        },
      ],
    },
    {
      name: "Aparência",
      url: "/admin/appearance",
      icon: <Icon name="Palette" />,
      roles: ["OWNER"],
      minPlan: "TSUNAMI",
    },

    // SMART_PRO+
    {
      name: "Fornecedores & Lojas",
      url: "/admin/suppliers",
      icon: <Icon name="Store" />,
      roles: ["OWNER", "MANAGER"],
      minPlan: "SMART_PRO",
    },
    {
      name: "GestAI",
      url: "/mindgest/gestai",
      icon: <Icon name="Bot" />,
      roles: ["OWNER", "MANAGER"],
      minPlan: "SMART_PRO",
    },
    {
      name: "Análise de Estoque",
      url: "/admin/stock-analysis",
      icon: <Icon name="ChartPie" />,
      roles: ["OWNER", "MANAGER"],
      minPlan: "SMART_PRO",
    },
    {
      name: "Gestão de POS",
      url: "/admin/pos-management",
      icon: <Icon name="SquareTerminal" />,
      roles: ["OWNER"],
      minPlan: "SMART_PRO",
    },
  ],
};
