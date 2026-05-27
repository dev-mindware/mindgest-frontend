import { AppSidebar, BreadcrumbProvider, SidebarInset } from "@/components";
import { TrialBanner } from "@/components/shared";
import { NotificationDetail } from "@/components/shared/notifications";
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
            <TrialBanner />
            <BreadcrumbProvider>{children}</BreadcrumbProvider>
          </SidebarInset>
          <NotificationDetail />
        </FeatureGateProvider>
      </StoreProvider>
    </RouteProtector>
  );
}
