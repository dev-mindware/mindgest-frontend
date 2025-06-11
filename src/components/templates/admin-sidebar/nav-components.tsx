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
} from "@/components"
import { useState } from "react"

export function AdminNavMenu({
  items,
}: {
  items: {
    title?: string
    name?: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    showMoreIcon?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const toggleSubmenu = (id: string) => {
    setOpenSubmenu((prev) => (prev === id ? null : id))
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const id = item.title || item.name || item.url

          if (item.items && item.items.length > 0) {
            const isOpen = openSubmenu === id

            return (
              <SidebarMenuItem key={id}>
                <SidebarMenuButton onClick={() => toggleSubmenu(id)} tooltip={id}>
                  {item.icon && item.icon}
                  <span>{id}</span>
                  <Icon
                    name="ChevronRight"
                    className={`ml-auto transition-transform duration-200 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </SidebarMenuButton>

                {isOpen && (
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
                )}
              </SidebarMenuItem>
            )
          }

          return (
            <SidebarMenuItem key={id}>
              <SidebarMenuButton asChild tooltip={id}>
                <Link href={item.url}>
                  {item.icon && item.icon}
                  <span>{id}</span>
                </Link>
              </SidebarMenuButton>
              {item.showMoreIcon && (
                <SidebarMenuAction>
                  <Icon name="Loader" className="text-primary" />
                </SidebarMenuAction>
              )}
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
