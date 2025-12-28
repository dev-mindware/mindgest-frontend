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
      name: "Clientes",
      url: "/client/clients",
      icon: <Icon name="Users" />,
      roles: ["ADMIN", "MANAGER", "OWNER"],
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
        {
          name: "Controle de Estoque",
          url: "/client/reports/stock-control",
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
    // AQUI COMEÇA O TSUNAMI
    {
      name: "Estoque",
      url: "/client/stock",
      icon: <Icon name="Boxes" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "Tsunami",
    },
    {
      name: "POS",
      url: "/client/pos",
      icon: <Icon name="Monitor" />,
      roles: ["CASHIER", "OWNER", "MANAGER"],
      minPlan: "Tsunami",
      items: [
        { name: "Novo ponto de Venda", url: "/client/pos/new" },
        { name: "Movimentos de Caixa", url: "/client/pos/moviments-box" },
        {
          name: "Configurações",
          url: "/client/pos/settings",
          roles: ["CASHIER", "CASHIER", "OWNER", "MANAGER"],
          minPlan: "Smart Pro",
        },
      ],
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


/*
import { Icon } from "@/components";
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

export type MenuStructure = Record<Role, MenuItem[]>;

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

export const ownerMenu: MenuItem[] = [
  {
    name: "Dashboard",
    url: "/owner/dashboard",
    icon: <Icon name="LayoutDashboard" />,
    minPlan: "Base",
  },
  {
    name: "GestIA",
    url: "/owner/gestia",
    icon: <Icon name="Sparkles" />,
    minPlan: "Base",
    showUpgrade: true,
  },
  {
    name: "Planos",
    url: "/owner/plans",
    icon: <Icon name="Wallet" />,
    minPlan: "Base",
  },
  {
    name: "owneres",
    url: "/owner/clients",
    icon: <Icon name="Users" />,
    minPlan: "Base",
  },
  {
    name: "Documentos",
    url: "/client/documents",
    icon: <Icon name="ScrollText" />,
    minPlan: "Base",
  },
  {
    name: "Items",
    url: "/owner/items",
    icon: <Icon name="ShoppingBasket" />,
    minPlan: "Base",
  },
  {
    name: "Relatórios",
    url: "#",
    icon: <Icon name="ChartBar" />,
    minPlan: "Base",
    items: [
      { name: "Vendas", url: "/owner/reports/sales" },
      { name: "Clientes", url: "/owner/reports/clients" },
      {
        name: "Controle de Acesso",
        url: "/owner/reports/access-control",
        minPlan: "Smart Pro",
      },
      {
        name: "Controle de Estoque",
        url: "/owner/reports/stock-control",
        minPlan: "Smart Pro",
      },
    ],
  },
  {
    name: "Notificações",
    url: "/owner/notifications",
    icon: <Icon name="Bell" />,
    minPlan: "Base",
  },
  {
    name: "Configurações",
    url: "/owner/settings",
    icon: <Icon name="Settings" />,
    minPlan: "Base",
  },
  {
    name: "Estoque",
    url: "/owner/stock",
    icon: <Icon name="Boxes" />,
    minPlan: "Tsunami",
  },
  {
    name: "POS",
    url: "/owner/pos",
    icon: <Icon name="Monitor" />,
    minPlan: "Tsunami",
    items: [
      { name: "Novo Ponto de Venda", url: "/owner/pos/new" },
      { name: "Movimentos de Caixa", url: "/owner/pos/moviments-box" },
      {
        name: "Configurações",
        url: "/owner/pos/settings",
        minPlan: "Smart Pro",
      },
    ],
  },
  {
    name: "Aparência",
    url: "/owner/appearance",
    icon: <Icon name="Palette" />,
    minPlan: "Tsunami",
  },
  {
    name: "Fornecedores & Lojas",
    url: "/owner/suppliers",
    icon: <Icon name="Store" />,
    minPlan: "Smart Pro",
  },
  {
    name: "GestAI",
    url: "/owner/gestai",
    icon: <Icon name="Bot" />,
    minPlan: "Smart Pro",
  },
  {
    name: "Análise de Estoque",
    url: "/owner/stock-analysis",
    icon: <Icon name="ChartPie" />,
    minPlan: "Smart Pro",
  },
  {
    name: "Gestão de POS",
    url: "/owner/pos-management",
    icon: <Icon name="SquareTerminal" />,
    minPlan: "Smart Pro",
  },
];

export const managerMenu: MenuItem[] = [
  {
    name: "Dashboard",
    url: "/manager/dashboard",
    icon: <Icon name="LayoutDashboard" />,
  },
  {
    name: "Clientes",
    url: "/manager/clients",
    icon: <Icon name="Users" />,
  },
  {
    name: "Documentos",
    url: "/manager/documents",
    icon: <Icon name="ScrollText" />,
  },
  {
    name: "Items",
    url: "/manager/items",
    icon: <Icon name="ShoppingBasket" />,
  },
  {
    name: "Relatórios",
    url: "#",
    icon: <Icon name="ChartBar" />,
    items: [
      { name: "Vendas", url: "/manager/reports/sales" },
      { name: "manageres", url: "/manager/reports/managers" },
    ],
  },
  {
    name: "Notificações",
    url: "/manager/notifications",
    icon: <Icon name="Bell" />,
  },
  {
    name: "Estoque",
    url: "/manager/stock",
    icon: <Icon name="Boxes" />,
    minPlan: "Tsunami",
  },
  {
    name: "POS",
    url: "/manager/pos",
    icon: <Icon name="Monitor" />,
    items: [
      { name: "Novo Ponto de Venda", url: "/manager/pos/new" },
      { name: "Movimentos de Caixa", url: "/manager/pos/moviments-box" },
    ],
  },
];

export const sellerMenu: MenuItem[] = [
  {
    name: "Dashboard",
    url: "/seller/dashboard",
    icon: <Icon name="LayoutDashboard" />,
  },
  {
    name: "Clientes",
    url: "/seller/clients",
    icon: <Icon name="Users" />,
  },
  {
    name: "Items",
    url: "/seller/items",
    icon: <Icon name="ShoppingBasket" />,
  },
  {
    name: "POS",
    url: "/seller/pos",
    icon: <Icon name="Monitor" />,
    items: [{ name: "Novo Ponto de Venda", url: "/seller/pos/new" }],
  },
];

export const cashierMenu: MenuItem[] = [
  {
    name: "Dashboard",
    url: "/cashier/dashboard",
    icon: <Icon name="LayoutDashboard" />,
  },
  {
    name: "POS",
    url: "/cashier/pos",
    icon: <Icon name="Monitor" />,
    items: [
      { name: "Novo Ponto de Venda", url: "/cashier/pos/new" },
      { name: "Movimentos de Caixa", url: "/cashier/pos/moviments-box" },
    ],
  },
];



export const menuItems: MenuStructure = {
  ADMIN: adminMenu,
  OWNER: ownerMenu,
  MANAGER: managerMenu,
  SELLER: sellerMenu,
  CASHIER: cashierMenu,
};

*/