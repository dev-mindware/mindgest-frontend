import {
  Separator,
  SidebarTrigger,
  SectionCards,
  ChartAreaInteractive,
  DinamicBreadcrumb,
  UsersTable
} from "@/components";

export default function Page() {
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DinamicBreadcrumb subRoute="Dashboard" showSeparator={false}/>
        </div>
      </header>
      <div className="flex flex-col flex-1">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 space-y-5 lg:px-6">
              <ChartAreaInteractive />
              <UsersTable/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

