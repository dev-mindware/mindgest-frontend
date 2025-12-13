import { PageWrapper } from "@/components";
import { ClientsReportsContent } from "@/components/clients/reports"; 

export default function ClientsReports() {
  return (
    <PageWrapper subRoute="Relatórios de Clientes" >
      <ClientsReportsContent />
    </PageWrapper>
  );
}
