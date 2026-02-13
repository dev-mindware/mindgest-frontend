import { AppSidebar, BreadcrumbProvider, SidebarInset } from "@/components";
import { RouteProtector } from "@/contexts";
import { FeatureGateProvider } from "@/providers";

type Props = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: Props) {
  return (
    <RouteProtector allowed={["OWNER", "MANAGER"]}>
      <FeatureGateProvider>
        <AppSidebar />
        <SidebarInset>
          <BreadcrumbProvider>{children}</BreadcrumbProvider>
        </SidebarInset>
      </FeatureGateProvider>
    </RouteProtector>
  );
}
