import { DinamicBreadcrumb } from "@/components/custom";
import { Separator, SidebarTrigger } from "@/components/ui";

type Props = {
  subRoute: string;
  children: React.ReactNode;
};

export function PageWrapper({ subRoute, children }: Props) {
  return (
    <div>
      <header className="flex h-16 sticky top-0 z-50 shrink-0 bg-white border-b items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DinamicBreadcrumb subRoute={subRoute} showSeparator={false} />
        </div>
      </header>
      <div className="flex flex-col flex-1">
        <div className="@container/main flex flex-1 p-4 flex-col gap-2">
          {children}
        </div>
      </div>
    </div>
  );
}
