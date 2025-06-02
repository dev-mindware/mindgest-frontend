import { PosAppSidebar, BreadcrumbProvider, SidebarInset, SidebarProvider, } from "@/components"
export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <PosAppSidebar />
      <SidebarInset>
        <BreadcrumbProvider>
        {children}
        </BreadcrumbProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
