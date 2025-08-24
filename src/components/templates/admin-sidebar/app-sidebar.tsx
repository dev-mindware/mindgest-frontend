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
  SidebarSkeleton,
} from "@/components";
import { adminMenu, menuItems } from "@/constants/menu-items";
import { getSidebarForUser } from "@/lib/get-sidebar-for-user";
import { useAuthStore } from "@/stores/auth";

export function AppSidebar() {
  const user = useAuthStore((state) => state.user);

  if (!user) return <SidebarSkeleton />;

  const filteredMenu =
    user.role === "ADMIN"
      ? adminMenu
      : getSidebarForUser(menuItems.menuItems, user.role, user.company.plan);

  return (
    <Sidebar collapsible="icon">
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
