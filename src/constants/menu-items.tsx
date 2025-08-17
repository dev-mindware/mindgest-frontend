// src/constants/menu-items.ts
import { Icon } from "@/components";
import { icons } from "lucide-react";
import { Role, Plan } from "@/types"; // enums: ADMIN, MANAGER, CASHIER, OWNER, etc. e BASE, TSUNAMI, SMART_PRO

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
  showUpgrade?: boolean; // marketing
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
    name: "Configurações Globais",
    url: "/super/settings",
    icon: <Icon name="Settings" />,
    roles: ["ADMIN"],
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
      url: "/client/dashboard",
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
      roles: ["ADMIN", "MANAGER", "OWNER"],
      minPlan: "BASE",
    },
    {
      name: "Entidades",
      url: "/client/entities",
      icon: <Icon name="Users" />,
      roles: ["ADMIN", "MANAGER", "OWNER"],
      minPlan: "BASE",
    },
    {
      name: "Exportações",
      url: "/admin/export",
      icon: <Icon name="FileDown" />,
      roles: ["ADMIN"],
      minPlan: "BASE",
    },
    {
      name: "Relatórios",
      url: "#",
      icon: <Icon name="ChartBar" />,
      roles: ["ADMIN", "MANAGER"],
      minPlan: "BASE",
      items: [
        {
          name: "Vendas simplificadas (mês/ano)",
          url: "/admin/reports/simple",
        },
        {
          name: "Vendas filtradas por data",
          url: "/admin/reports/by-date",
          minPlan: "TSUNAMI",
        },
        {
          name: "Controle de Acesso",
          url: "/admin/reports/access-control",
          minPlan: "SMART_PRO",
        },
        {
          name: "Controle de Estoque",
          url: "/admin/reports/stock-control",
          minPlan: "SMART_PRO",
        },
        {
          name: "Controle de Vendas",
          url: "/admin/reports/sales-control",
          minPlan: "SMART_PRO",
        },
        {
          name: "Fiscalidade",
          url: "/admin/reports/fiscal",
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

    // Configurações gerais
    {
      name: "Definições",
      url: "/settings",
      icon: <Icon name="Settings2" />,
      roles: ["ADMIN"],
      minPlan: "BASE",
      items: [
        { name: "Geral", url: "/settings/general" },
        { name: "Exportação", url: "/settings/export" },
      ],
    },
  ],
};
/* // src/constants/menu-items.ts
import { Icon } from "@/components";
import { icons } from "lucide-react";
import { Role, Plan } from "@/types"; // enums que definem roles e planos

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

export const menuItems: MenuStructure = {
  teams: [
    { name: "Mindware, Lda", logo: "GalleryVerticalEnd", plan: "Empresa" },
    { name: "Mindware Studio", logo: "AudioWaveform", plan: "Startup" },
    { name: "MindSchool", logo: "University", plan: "Free" },
  ],
  menuItems: [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
      icon: <Icon name="LayoutDashboard" />,
      roles: ["ADMIN", "MANAGER", "OWNER"],
      minPlan: "BASE",
    },
    {
      name: "POS",
      url: "/mindgest/pos",
      icon: <Icon name="Monitor" />,
      roles: ["ADMIN", "CASHIER"],
      minPlan: "BASE",
      items: [
        { name: "Novo ponto de Venda", url: "/mindgest/pos/new" },
        { name: "Movimentos de Caixa", url: "/mindgest/pos/moviments-box" },
        { name: "Configurações", url: "/mindgest/pos/settings", roles: ["ADMIN"] },
      ],
    },
  ],
};
 */

/* import { Icon } from "@/components";
import { icons } from "lucide-react";
import { ReactNode } from "react";

type SubMenuItem = {
  name: string;
  url: string;
};

type MenuItem = {
  name: string;
  url: string;
  icon: ReactNode;
  showMoreIcon?: boolean;
  items?: SubMenuItem[];
};

type Team = {
  name: string;
  logo: keyof typeof icons;
  plan: string;
};

type MenuStructure = {
  teams: Team[];
  menuItems: MenuItem[];
};

export const menuItems: MenuStructure = {
  teams: [
    {
      name: "Mindware, Lda",
      logo: "GalleryVerticalEnd",
      plan: "Empresa",
    },
    {
      name: "Mindware Studio",
      logo: "AudioWaveform",
      plan: "Startup",
    },
    {
      name: "MindSchool",
      logo: "University",
      plan: "Free",
    },
  ],
  menuItems: [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
      icon: <Icon name="LayoutDashboard" />,
    },
    {
      name: "Documentos",
      url: "#",
      icon: <Icon name="ScrollText" />,
      items: [
        { name: "Faturação", url: "/admin/doc-management/billing" },
        { name: "Outros", url: "/admin/doc-management/other" },
      ],
    },
    {
      name: "Relatórios",
      url: "#",
      icon: <Icon name="MessageSquareWarning" />,
      items: [
        { name: "Controle de Acesso", url: "#" },
        { name: "Controle de Stock", url: "#" },
        { name: "Controle de Vendas", url: "#" },
        { name: "Fiscalidade", url: "#" },
      ],
    },
    {
      name: "Finanças",
      url: "/money",
      icon: <Icon name="Activity" />,
      showMoreIcon: true,
    },
    {
      name: "Recursos Humanos",
      url: "/human-resources",
      icon: <Icon name="Dessert" />,
      showMoreIcon: true,
    },
    {
      name: "GestAI",
      url: "/mindgest/gestai",
      icon: <Icon name="Bot" />,
      showMoreIcon: true,
    },
    {
      name: "POS",
      url: "/mindgest/pos",
      icon: <Icon name="Monitor" />,
      items: [
        { name: "Novo ponto de Venda", url: "/new" },
        { name: "Movimentos de Caixa", url: "/moviments-box" },
        { name: "Configurações", url: "/pos/settings" },
      ],
    },
    {
      name: "Definições",
      url: "/settings",
      icon: <Icon name="Settings2" />,
      items: [
        { name: "Geral", url: "/admin/definitions/general" },
        { name: "Exportação", url: "/admin/definitions/export" },
      ],
    },
  ],
};
 */
