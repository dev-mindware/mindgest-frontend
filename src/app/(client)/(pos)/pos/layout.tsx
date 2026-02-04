import {
  AppSidebar,
  BreadcrumbProvider,
  SidebarInset,
  SidebarProvider,
  MobilePosGuard,
} from "@/components";
import { RouteProtector } from "@/contexts";
import { TooltipProvider } from "@/components/ui/tooltip";
import { KeyboardGuard } from "@/components/client/pos/common/keyboard-guard";

type Props = {
  children: React.ReactNode;
};

export default function POSLayout({ children }: Props) {
  return (
    <RouteProtector allowed={["CASHIER"]}>
      <MobilePosGuard />
      <SidebarProvider defaultOpen={false}>
        <KeyboardGuard>
          <TooltipProvider delayDuration={200}>
            <AppSidebar />
            <SidebarInset>
              <BreadcrumbProvider>{children}</BreadcrumbProvider>
            </SidebarInset>
          </TooltipProvider>
        </KeyboardGuard>
      </SidebarProvider>
    </RouteProtector>
  );
}
