import { SectionCards, PageWrapper } from "@/components";

export default function DashboardPage() {
  return (
    <PageWrapper subRoute="Dashboard">
      <div className="space-y-5">
        <SectionCards />
      </div>
    </PageWrapper>
  );
}
