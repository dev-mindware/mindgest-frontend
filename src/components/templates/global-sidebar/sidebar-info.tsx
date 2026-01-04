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
  Skeleton,
} from "@/components";
import { useAuth } from "@/hooks/auth";
import { useGetStores } from "@/hooks/entities";
import { currentStoreStore } from "@/stores/current-store-store";
import { useEffect } from "react";

export function SidebarCompanyInfo() {
  const { user } = useAuth();
  const { isMobile } = useSidebar();
  const {
    storesData,
    isLoading: loadingStores,
    error: storesError,
    refetch,
  } = useGetStores();
  const { currentStore, setCurrentStore } = currentStoreStore();

  useEffect(() => {
    if (!currentStore && storesData?.length > 0) {
      setCurrentStore(storesData[0]);
    }
  }, [storesData, currentStore, setCurrentStore]);

  if (loadingStores) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

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
                  {currentStore?.name || user?.company?.name || "Empresa"}
                </span>
                <span className="text-xs truncate">
                  {currentStore ? "Loja Selecionada" : "Selecione uma loja"}
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
              Lojas
            </DropdownMenuLabel>
            {storesData?.map((store) => (
              <DropdownMenuItem
                key={store.id}
                onClick={() => setCurrentStore(store)}
                className="gap-2 p-2"
              >
                <div className="flex items-center justify-center border rounded-md size-6">
                  <Icon name="Building2" className="size-3.5 shrink-0" />
                </div>
                {store.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex items-center justify-center bg-transparent border rounded-md size-6">
                <Icon name="Plus" className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Adicionar loja
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
