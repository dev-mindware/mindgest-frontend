import { AppSidebar, BreadcrumbProvider, SidebarInset } from "@/components";
import { RouteProtector } from "@/contexts";

type Props = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: Props) {
  return (
    <RouteProtector allowed={["OWNER", "MANAGER"]}>
      <AppSidebar />
      <SidebarInset>
        <BreadcrumbProvider>{children}</BreadcrumbProvider>
      </SidebarInset>
    </RouteProtector>
  );
}
