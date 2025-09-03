import { AppSidebar, BreadcrumbProvider, SidebarInset } from "@/components";

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <BreadcrumbProvider>{children}</BreadcrumbProvider>
      </SidebarInset>
    </>
  );
}
