import { AppSidebar, BreadcrumbProvider, SidebarInset } from "@/components";
import { PlanGuard } from "@/components/common/plan-guard";
import { RouteProtector } from "@/contexts";
import { FeatureGateProvider, StoreProvider } from "@/providers";

type Props = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: Props) {
  return (
    <RouteProtector allowed={["OWNER", "MANAGER"]}>
      <StoreProvider>
        <FeatureGateProvider>
          <AppSidebar />
          <SidebarInset>
            <PlanGuard>
              <BreadcrumbProvider>{children}</BreadcrumbProvider>
            </PlanGuard>
          </SidebarInset>
        </FeatureGateProvider>
      </StoreProvider>
    </RouteProtector>
  );
}
