// src/components/AdminNavMenu.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "@/components";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/constants/menu-items";

export function AdminNavMenu({ items }: { items: MenuItem[] }) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleSubmenu = (id: string) =>
    setOpenSubmenu((prev) => (prev === id ? null : id));

  const isActive = (url: string) => pathname.startsWith(url);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const id = item.name || item.url;
          const hasSubmenu = !!item.items?.length;
          const isOpen = openSubmenu === id;
          const activeMain =
            isActive(item.url) ||
            item.items?.some((sub) => isActive(sub.url));

          return (
            <SidebarMenuItem key={id}>
              {hasSubmenu ? (
                <>
                  <SidebarMenuButton
                    onClick={() => toggleSubmenu(id)}
                    tooltip={item.name}
                    className={cn(
                      activeMain
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    <Icon
                      name="ChevronRight"
                      className={`ml-auto transition-transform duration-200 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </SidebarMenuButton>

                  {isOpen && (
                    <SidebarMenuSub>
                      {item.items!.map((sub) => {
                        const activeSub = isActive(sub.url);
                        return (
                          <SidebarMenuSubItem key={sub.name}>
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                activeSub
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              )}
                            >
                              <Link href={sub.url}>
                                <span>{sub.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  )}
                </>
              ) : (
                <>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.name}
                    className={cn(
                      activeMain
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.showMoreIcon && (
                    <SidebarMenuAction>
                      <Icon name="Loader" className="text-primary" />
                    </SidebarMenuAction>
                  )}
                </>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
