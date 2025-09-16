import { PageWrapper } from "@/components";
import { AddDocuments } from "@/components/clients";

export default function AddDocsPage() {
  return (
    <PageWrapper
      routePath="/client/documents"
      routeLabel="Documentos"
      subRoute="Novo Documento"
      showSeparator={true}
    >
      <AddDocuments />
    </PageWrapper>
  );
}
