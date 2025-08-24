import { AppSidebar, BreadcrumbProvider, SidebarInset } from "@/components";

type Props = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: Props) {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <BreadcrumbProvider>{children}</BreadcrumbProvider>
      </SidebarInset>
    </>
  );
}
