import { DinamicBreadcrumb } from "@/components/custom";
import { Separator, SidebarTrigger } from "@/components/ui";

type Props = {
  routePath?: string;
  routeLabel?: string;
  subRoute: string;
  showSeparator?: boolean;
  children: React.ReactNode;
};

export function PageWrapper({ routePath, routeLabel, subRoute, showSeparator = true, children }: Props) {
  return (
    <div className="">
      <header className="flex h-16 sticky top-0 z-50 shrink-0 bg-sidebar border-b items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DinamicBreadcrumb routePath={routePath} routeLabel={routeLabel} subRoute={subRoute} showSeparator={showSeparator} />
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
