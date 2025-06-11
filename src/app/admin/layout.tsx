import { AdminAppSidebar, BreadcrumbProvider, SidebarInset, SidebarProvider, } from "@/components"
export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminAppSidebar />
      <SidebarInset>
        <BreadcrumbProvider>
        {children}
        </BreadcrumbProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
