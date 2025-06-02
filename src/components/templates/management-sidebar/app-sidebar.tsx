"use client"

import * as React from "react"
import { ManagementNavMenu, ManagementNavUser, ManagementTeamSwitcher, Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, Icon } from "@/components"
import { GalleryVerticalEnd, AudioWaveform, University } from "lucide-react";
// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Mindware, Lda",
      logo: GalleryVerticalEnd,
      plan: "Empresa",
    },
    {
      name: "Mindware Studio",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "MindSchool",
      logo: University,
      plan: "Free",
    },
  ],
  menuItems: [
    {
      name: "Dashboard",
      url: "/management/dashboard",
      icon: <Icon name="LayoutDashboard"/>,
    },
    {
      title: "Gestão de Stock",
      url: "#",
      icon: <Icon name="ShoppingBasket"/>,
      isActive: true,
      items: [
        {
          title: "Análise",
          url: "/management/stock/analysis",
        },
        {
          title: "Gestão de Produtos",
          url: "/management/stock/products-management",
        },
      ],
    },
    {
      title: "Gestão de Documentos",
      url: "#",
      icon: <Icon name="ScrollText"/>,
      items: [
        {
          title: "Faturação",
          url: "#",
        },
        {
          title: "Outros",
          url: "#",
        },
      ],
    },
    {
      title: "Relatórios",
      url: "#",
      icon: <Icon name="MessageSquareWarning"/>,
      items: [
        {
          title: "Controle de Acesso",
          url: "#",
        },
        {
          title: "Controle de Stock",
          url: "#",
        },
        {
          title: "Controle de Vendas",
          url: "#",
        },
        {
          title: "Fiscalidade",
          url: "#",
        },
      ],
    },
    {
      name: "Gestão Financeira",
      url: "#",
      icon: <Icon name="Activity"/>,
      showMoreIcon: true,
    },
    {
      name: "Recursos Humanos",
      url: "#",
      icon: <Icon name="Dessert"/>,
      showMoreIcon: true,
    },
    {
      name: "GestAI",
      url: "#",
      icon: <Icon name="Bot"/>,
      showMoreIcon: true,
    },
    {
      name: "Gestão de POS",
      url: "#",
      icon: <Icon name="TextSelect"/>,
    },
    {
      title: "Definições",
      url: "#",
      icon: <Icon name="Settings2"/>,
      items: [
        {
          title: "Geral",
          url: "#",
        },
        {
          title: "Exportação",
          url: "#",
        },
      ],
    },
  ],
}

export function ManagementAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ManagementTeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <ManagementNavMenu items={data.menuItems} />
      </SidebarContent>
      <SidebarFooter>
        <ManagementNavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}