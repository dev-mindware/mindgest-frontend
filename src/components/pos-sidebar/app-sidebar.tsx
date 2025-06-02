"use client"

import * as React from "react"
import {
  Activity,
  AudioWaveform,
  GalleryVerticalEnd,
  ReceiptText,
  Settings2,
  University,
} from "lucide-react"

import { PosNavMenu } from "@/components/pos-sidebar"
import { PosNavUser } from "@/components/pos-sidebar"
import { PosTeamSwitcher } from "@/components/pos-sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui"

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
      name: "Caixa",
      url: "#",
      icon: ReceiptText,
    },
    {
      name: "Movimentos",
      url: "#",
      icon: Activity,
    },
    {
      name: "Definições",
      url: "#",
      icon: Settings2,
    },
  ],
}

export function PosAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <PosTeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <PosNavMenu items={data.menuItems} />
      </SidebarContent>
      <SidebarFooter>
        <PosNavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}