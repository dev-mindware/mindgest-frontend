import { PageWrapper } from "@/components";
import { DocumentList } from "@/components/clients";

export default function Page() {
  return (
    <PageWrapper subRoute="Documentos">
      <DocumentList />
    </PageWrapper>
  );
}
