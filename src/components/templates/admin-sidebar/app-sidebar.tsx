"use client";
import {
  AdminNavMenu,
  AdminNavUser,
  AdminTeamSwitcher,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components";
import { adminMenu, menuItems } from "@/constants/menu-items";
import { getSidebarForUser } from "@/lib/get-sidebar-for-user";
import { useAuthStore } from "@/stores/auth";

export function AdminAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const filteredMenu =
    user.role === "ADMIN"
      ? adminMenu
      : getSidebarForUser(menuItems.menuItems, user.role, user.company.plan);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AdminTeamSwitcher teams={menuItems.teams} />
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMenu items={filteredMenu} />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
