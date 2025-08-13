import {
  AdminAppSidebar,
  BreadcrumbProvider,
  SidebarInset,
  SidebarProvider,
} from "@/components";

type Props = {
  children: React.ReactNode;
};

export default function ManagementLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AdminAppSidebar />
      <SidebarInset>
        <BreadcrumbProvider>{children}</BreadcrumbProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
