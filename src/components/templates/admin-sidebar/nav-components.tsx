"use client";

import Link from "next/link";
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

type SubMenuItem = {
  name: string;
  url: string;
};

type MenuItem = {
  name: string;
  url: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  showMoreIcon?: boolean;
  items?: SubMenuItem[];
};

export function AdminNavMenu({ items }: { items: MenuItem[] }) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (id: string) => {
    setOpenSubmenu((prev) => (prev === id ? null : id));
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const id = item.name || item.url;
          const hasSubmenu = !!item.items?.length;
          const isOpen = openSubmenu === id;

          return (
            <SidebarMenuItem key={id}>
              {hasSubmenu ? (
                <>
                  <SidebarMenuButton
                    onClick={() => toggleSubmenu(id)}
                    tooltip={item.name}
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
                      {item.items!.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.name}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </>
              ) : (
                <>
                  <SidebarMenuButton asChild tooltip={item.name}>
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
