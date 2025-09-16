import { AppSidebar, BreadcrumbProvider, SidebarInset } from "@/components";

type Props = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: Props) {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <div className="bg-gray-50 dark:bg-zinc-900">
          <BreadcrumbProvider>{children}</BreadcrumbProvider>
        </div>
      </SidebarInset>
    </>
  );
}
