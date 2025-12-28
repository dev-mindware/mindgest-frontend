import { PageWrapper } from "@/components";
import { StockManagementContent } from "@/components/clients/management";

export default function StockPage() {
  return (
    <PageWrapper subRoute="Gestão de Estoque">
      <StockManagementContent />
    </PageWrapper>
  );
}
