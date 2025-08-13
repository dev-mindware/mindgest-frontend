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
import { UpgradeModal } from "@/components/upgrade-modal";
import { useModal } from "@/stores";

export function AdminNavMenu({ items }: { items: MenuItem[] }) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [upgradeItem, setUpgradeItem] = useState<MenuItem | null>(null);
  const pathname = usePathname();
  const { openModal } = useModal();

  const toggleSubmenu = (id: string) =>
    setOpenSubmenu((prev) => (prev === id ? null : id));

  const isActive = (url: string) => pathname.startsWith(url);

  const handleClickUpgrade = (e: React.MouseEvent, item: MenuItem) => {
    if (item.showUpgrade) {
      e.preventDefault();
      setUpgradeItem(item);
      openModal("upgrade-modal");
    }
  };

  return (
    <>
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
                      onClick={(e) =>
                        item.showUpgrade
                          ? handleClickUpgrade(e, item)
                          : toggleSubmenu(id)
                      }
                      tooltip={item.name}
                      className={cn(
                        activeMain
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                      {item.showUpgrade && (
                        <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Pro
                        </span>
                      )}
                      {!item.showUpgrade && (
                        <Icon
                          name="ChevronRight"
                          className={`ml-auto transition-transform duration-200 ${
                            isOpen ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </SidebarMenuButton>

                    {!item.showUpgrade && isOpen && (
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
                      asChild={!item.showUpgrade}
                      tooltip={item.name}
                      onClick={(e) =>
                        item.showUpgrade && handleClickUpgrade(e, item)
                      }
                      className={cn(
                        activeMain
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      {item.showUpgrade ? (
                        <div className="flex items-center gap-2 cursor-pointer">
                          {item.icon}
                          <span>{item.name}</span>
                          <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            Pro
                          </span>
                        </div>
                      ) : (
                        <Link href={item.url}>
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      )}
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

      {upgradeItem && <UpgradeModal feature={upgradeItem.name} />}
    </>
  );
}
