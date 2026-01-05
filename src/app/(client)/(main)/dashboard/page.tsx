import {
  PageWrapper,
  DashboardCharts,
  TitleList,
  DashboardAnalisys,
} from "@/components";

export default function Page() {
  return (
    <PageWrapper routeLabel="Dashboard" subRoute="Dashboard">
      <TitleList suTitle="Painel Administrativo" />

      <div className="flex flex-col gap-4 mt-4 md:gap-6">
        <DashboardAnalisys/>
        <div className="space-y-5">
          <TitleList suTitle="Estatísticas" />
          <DashboardCharts />

          <div className="space-y-4">
            <TitleList suTitle="Vendas Recentes" />
            {/* <SubmissionsList data={mockSubmissions.slice(0, 5)} /> */}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
