import {
  AppSidebar,
  BreadcrumbProvider,
  SidebarInset,
} from "@/components";

type Props = {
  children: React.ReactNode;
};

export default function ManagementLayout({ children }: Props) {
  return (
    <>
      <AppSidebar />
      <h1>ola eu sou o layout</h1>
      <SidebarInset>
        <BreadcrumbProvider>{children}</BreadcrumbProvider>
      </SidebarInset>
    </>
  );
}
