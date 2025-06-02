"use client"

import Link from "next/link"
import {
  Icon,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components"

export function ManagementNavMenu({
  items,
}: {
  items: {
    title?: string
    name?: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    showMoreIcon?: boolean // 👈 nova propriedade
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          if (item.items && item.items.length > 0) {
            return (
              <Collapsible
                key={item.title || item.name}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title || item.name}>
                      {item.icon && item.icon}
                      <span>{item.title || item.name}</span>
                      <Icon name="ChevronRight" className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          return (
            <SidebarMenuItem key={item.title || item.name}>
              <SidebarMenuButton asChild tooltip={item.title || item.name}>
                <Link href={item.url}>
                  {item.icon && item.icon}
                  <span>{item.title || item.name}</span>
                </Link>
              </SidebarMenuButton>

              {/* 👇 Só aparece se showMoreIcon for true */}
              {item.showMoreIcon && (
                <SidebarMenuAction>
                  <Icon name="Loader" className="text-primary"/>
                </SidebarMenuAction>
              )}
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
