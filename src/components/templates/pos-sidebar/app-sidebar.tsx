"use client"

import * as React from "react"
import { GalleryVerticalEnd, AudioWaveform, University } from "lucide-react"
import { PosNavMenu, PosNavUser, PosTeamSwitcher, Icon, Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, } from "@/components"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  menuItems: [
    {
      name: "Caixa",
      url: "#",
      icon: <Icon name="ReceiptText"/>,
    },
    {
      name: "Movimentos",
      url: "#",
      icon: <Icon name="Activity"/>,
    },
    {
      name: "Definições",
      url: "#",
      icon: <Icon name="Settings2"/>,
    },
  ],
}

export function PosAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <PosTeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <PosNavMenu items={data.menuItems} />
      </SidebarContent>
      <SidebarFooter>
        <PosNavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}