"use client";
import {
  Sidebar,
  SidebarRail,
  AdminNavUser,
  AdminNavMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarSkeleton,
  SidebarCompanyInfo,
} from "@/components";
import { adminMenu, menuItems } from "@/constants/menu-items";
import { getSidebarForUser } from "@/lib/get-sidebar-for-user";
import { useAuthStore } from "@/stores/auth";
import { PlanType } from "@/types";

export function AppSidebar() {
  const user = useAuthStore((state) => state.user);

  if (!user) return <SidebarSkeleton />;

  const plan = user?.company?.subscription
    ? (user.company?.subscription?.plan?.name as PlanType)
    : undefined;

  const filteredMenu =
    user.role === "ADMIN"
      ? adminMenu
      : getSidebarForUser(menuItems.menuItems, user.role, plan);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarCompanyInfo />
      </SidebarHeader>
      <SidebarContent className="group-data-[collapsible=icon]:items-center">
        <AdminNavMenu items={filteredMenu} />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}