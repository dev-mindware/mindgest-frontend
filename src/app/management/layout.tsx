import { ManagementAppSidebar } from "@/components/management-sidebar"
import { BreadcrumbProvider } from "@/components/ui/breadcrumb-context"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ManagementAppSidebar />
      <SidebarInset>
        <BreadcrumbProvider>
        {children}
        </BreadcrumbProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
