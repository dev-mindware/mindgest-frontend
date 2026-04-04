import { PageWrapper } from "@/components/common/page-wrapper";
import { SuppliersPageContent } from "@/components/client/suppliers";

export default function SuppliersPage() {
  return (
    <PageWrapper subRoute="Fornecedores" routeLabel="Fornecedores">
      <SuppliersPageContent />
    </PageWrapper>
  );
}