import {
  AppSidebar,
  BreadcrumbProvider,
  SidebarInset,
  SidebarProvider,
  MobilePosGuard,
} from "@/components";
import { VirtualKeyboard } from "@/components/common/virtual-keyboard";
import { RouteProtector, KeyboardProvider } from "@/contexts";

import { TooltipProvider } from "@/components/ui/tooltip";

type Props = {
  children: React.ReactNode;
};

export default function POSLayout({ children }: Props) {
  return (
    <RouteProtector allowed={["CASHIER"]}>
      <MobilePosGuard />
      <SidebarProvider defaultOpen={false}>
        <TooltipProvider delayDuration={200}>
          <KeyboardProvider>
            <AppSidebar />
            <SidebarInset>
              <BreadcrumbProvider>{children}</BreadcrumbProvider>
            </SidebarInset>
            <VirtualKeyboard />
          </KeyboardProvider>
        </TooltipProvider>
      </SidebarProvider>
    </RouteProtector>
  );
}
