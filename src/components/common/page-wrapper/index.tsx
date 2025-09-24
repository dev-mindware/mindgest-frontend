import { DinamicBreadcrumb } from "@/components/custom";
import { NotificationDropdown } from "@/components/shared/notifications";
import { Separator, SidebarTrigger } from "@/components/ui";

type Props = {
  routePath?: string;
  routeLabel?: string;
  subRoute: string;
  showSeparator?: boolean;
  children: React.ReactNode;
};

export function PageWrapper({
  routePath,
  routeLabel,
  subRoute,
  showSeparator = true,
  children,
}: Props) {
  return (
    <div className="bg-background">
      <header className="flex h-16 sticky top-0 z-50 shrink-0 bg-sidebar border-b items-center gap-2 transition-[width,height] ease-linear justify-between">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DinamicBreadcrumb
            routePath={routePath}
            routeLabel={routeLabel}
            subRoute={subRoute}
            showSeparator={showSeparator}
          />
        </div>
        <div className="flex items-center mr-4 space-x-2 md:space-x-4">
          <NotificationDropdown />
        </div>
      </header>
      <div className="flex flex-col flex-1 max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="@container/main flex flex-1 p-6 flex-col gap-2">
          {children}
        </div>
      </div>
    </div>
  );
}
