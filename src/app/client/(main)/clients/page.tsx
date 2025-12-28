import { ClientModal, ClientsList, PageWrapper, TitleList } from "@/components";

export default function page() {
  return (
    <PageWrapper routeLabel="Clientes" subRoute="Clientes">
      <TitleList title="Clientes" suTitle="Adicione e gerencie seus clientes" />
      <ClientsList />
      <ClientModal action="add" />
    </PageWrapper>
  );
}
