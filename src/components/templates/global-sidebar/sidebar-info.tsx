"use client";
import {
  Icon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components";
import { useAuth } from "@/hooks/auth";

export function SidebarCompanyInfo() {
  const { user } = useAuth();
  const { isMobile } = useSidebar();

  if (!user) return null;

  return (
    <SidebarMenu className="group-data-[collapsible=icon]:items-center">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground aspect-square size-8">
                <Icon name="Building2" className="size-4" />
              </div>
              <div className="grid flex-1 text-sm leading-tight text-left">
                <span className="font-medium truncate">
                  {user?.company?.name || "Empresa"}
                </span>
                <span className="text-xs truncate">
                  Plano {user?.company?.subscription?.plan.name || "Base"}
                </span>
              </div>
              <Icon name="ChevronsUpDown" className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex items-center justify-center border rounded-md size-6">
                <Icon name="Building2" className="size-3.5 shrink-0" />
              </div>
              {user?.company?.name}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex items-center justify-center bg-transparent border rounded-md size-6">
                <Icon name="Plus" className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
