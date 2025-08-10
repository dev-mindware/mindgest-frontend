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
import { menuItems } from "@/constants/menu-items";

export function AdminAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AdminTeamSwitcher teams={menuItems.teams} />
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMenu items={menuItems.menuItems} />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
