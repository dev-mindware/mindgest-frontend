"use client"

import * as React from "react"
import {
  Activity,
  AudioWaveform,
  BotIcon,
  University,
  Dessert,
  GalleryVerticalEnd,
  LayoutDashboard,
  MessageSquareWarning,
  ScrollText,
  Settings2,
  ShoppingBasket,
  TextSelect,
} from "lucide-react"

import { ManagementNavMenu } from "@/components/management-sidebar"
import { ManagementNavUser } from "@/components/management-sidebar"
import { ManagementTeamSwitcher } from "@/components/management-sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

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
      icon: LayoutDashboard,
    },
    {
      title: "Gestão de Stock",
      url: "#",
      icon: ShoppingBasket,
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
      icon: ScrollText,
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
      icon: MessageSquareWarning,
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
      icon: Activity,
    },
    {
      name: "Recursos Humanos",
      url: "#",
      icon: Dessert,
    },
    {
      name: "GestAI",
      url: "#",
      icon: BotIcon,
    },
    {
      name: "Gestão de POS",
      url: "#",
      icon: TextSelect,
    },
    {
      title: "Definições",
      url: "#",
      icon: Settings2,
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
      <SidebarContent className="p-2">
        <ManagementNavMenu items={data.menuItems} />
      </SidebarContent>
      <SidebarFooter>
        <ManagementNavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}