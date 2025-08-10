import { Icon } from "@/components";
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
