import {
  BreadcrumbProvider,
  SidebarInset,
  SidebarProvider,
} from "@/components";
export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarInset>
        <BreadcrumbProvider>{children}</BreadcrumbProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
