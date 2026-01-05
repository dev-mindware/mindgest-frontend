import { CreditNotes, PageWrapper } from "@/components";

type PageProps = {
  params: Promise<{ noteId: string }>;
};

export default async function CreditsNotes({ params }: PageProps) {
  const { noteId } = await params;

  return (
    <PageWrapper
      routePath="/documents"
      routeLabel="Documentos"
      subRoute="Notas de Crédito"
      showSeparator={true}
    >
      <CreditNotes noteId={noteId} />
    </PageWrapper>
  );
}
