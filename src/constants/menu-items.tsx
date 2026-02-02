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
      url: "/dashboard",
      icon: <Icon name="LayoutDashboard" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "Base",
    },
    {
      name: "GestIA",
      url: "/gestia",
      icon: <Icon name="Sparkles" className="w-5 h-5" />,
      roles: ["OWNER"],
      minPlan: "Base",
      showUpgrade: true,
    },
    {
      name: "Planos",
      url: "/plans",
      icon: <Icon name="Wallet" className="w-5 h-5" />,
      roles: ["OWNER"],
      minPlan: "Base",
    },
    {
      name: "Clientes",
      url: "/clients",
      icon: <Icon name="Users" />,
      roles: ["ADMIN", "MANAGER", "OWNER"],
      minPlan: "Base",
    },
    {
      name: "Documentos",
      url: "/documents",
      icon: <Icon name="ScrollText" />,
      roles: ["ADMIN", "MANAGER", "OWNER"],
      minPlan: "Base",
    },
    {
      name: "Items",
      url: "/items", //?tab=product
      icon: <Icon name="ShoppingBasket" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "Base",
    },
    {
      name: "Gestão",
      url: "#",
      icon: <Icon name="Boxes" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "Pro",
      items: [
        {
          name: "Estoque",
          url: "/management/stock",
        },
        {
          name: "POS",
          url: "/management/pos",
          minPlan: "Smart",
        },
      ],
    },
    {
      name: "Relatórios",
      url: "#",
      icon: <Icon name="ChartNetwork" />,
      roles: ["OWNER", "MANAGER"],
      minPlan: "Base",
      items: [
        {
          name: "Vendas",
          url: "/reports/sales",
        },
        {
          name: "Clientes",
          url: "/reports/clients",
          minPlan: "Pro",
        },
        {
          name: "Acesso e Auditoria",
          url: "/reports/access-control",
          minPlan: "Smart",
        },
      ],
    },
    {
      name: "Notificações",
      url: "/notifications",
      icon: <Icon name="Bell" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "Base",
    },
    {
      name: "Configurações",
      url: "/settings",
      icon: <Icon name="Settings2" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "Pro",
    },
    {
      name: "Configurações",
      url: "/pos/settings",
      icon: <Icon name="Settings2" />,
      roles: ["CASHIER"],
      minPlan: "Base",
    },
  ],
};