"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/management-sidebar/nav-main"
import { NavProjects } from "@/components/management-sidebar/nav-projects"
import { NavUser } from "@/components/management-sidebar/nav-user"
import { TeamSwitcher } from "@/components/management-sidebar/team-switcher"
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
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Gestão de Stock",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Análise",
          url: "#",
        },
        {
          title: "Gestão de Produtos",
          url: "#",
        },
      ],
    },
    {
      title: "Gestão de Documentos",
      url: "#",
      icon: Bot,
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
      icon: BookOpen,
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
  projects: [
    {
      name: "Dashboard",
      url: "#",
      icon: Frame,
    },
    {
      name: "Gestão Financeira",
      url: "#",
      icon: Map,
    },
    {
      name: "Recursos Humanos",
      url: "#",
      icon: Map,
    },
    {
      name: "GestAI",
      url: "#",
      icon: Map,
    },
    {
      name: "Gestão de POS",
      url: "#",
      icon: PieChart,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <NavProjects projects={[data.projects[0]]} />
        <NavMain items={data.navMain.filter((_, i) => i !== 3)} />
        <NavProjects projects={data.projects.slice(1)} />
        <NavMain items={[data.navMain[3]]}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
