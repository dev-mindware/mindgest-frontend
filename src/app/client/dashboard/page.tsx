import {
  SectionCards,
  ChartAreaInteractive,
  UsersTable,
  PageWrapper,
} from "@/components";

export default function Page() {
  return (
    <PageWrapper subRoute="Dashboard">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 space-y-5 lg:px-6">
          <ChartAreaInteractive />
          <UsersTable />
        </div>
      </div>
    </PageWrapper>
  );
}
