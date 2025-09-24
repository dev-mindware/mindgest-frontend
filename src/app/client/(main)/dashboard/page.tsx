import {
  PageWrapper,
  DashboardMetrics,
  DashboardCharts,
  TitleList,
} from "@/components";

export default function Page() {
  return (
    <PageWrapper routeLabel="Dashboard" subRoute="Dashboard">
      <TitleList suTitle="Painel Administrativo" />

      <div className="flex flex-col gap-4 mt-4 md:gap-6">
        <DashboardMetrics />
        <div className="space-y-5">
          <TitleList suTitle="Estatísticas" />
          <DashboardCharts />

          <div className="space-y-4">
            <TitleList title="Candidaturas Recentes" />
            {/* <SubmissionsList data={mockSubmissions.slice(0, 5)} /> */}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
