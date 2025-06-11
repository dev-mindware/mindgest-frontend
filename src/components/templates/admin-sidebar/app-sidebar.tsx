"use client"

import * as React from "react"
import { AdminNavMenu, AdminNavUser, AdminTeamSwitcher, Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, Icon } from "@/components"
import { GalleryVerticalEnd, AudioWaveform, University } from "lucide-react";
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
      url: "/admin/dashboard",
      icon: <Icon name="LayoutDashboard"/>,
    },
    {
      title: "Gestão de Documentos",
      url: "#",
      icon: <Icon name="ScrollText"/>,
      items: [
        {
          title: "Faturação",
          url: "/admin/doc-management/billing",
        },
        {
          title: "Outros",
          url: "/admin/doc-management/other",
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

export function AdminAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AdminTeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMenu items={data.menuItems} />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}