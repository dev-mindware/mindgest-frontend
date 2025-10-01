import { PageWrapper } from "@/components";
// import { AddEntities } from "@/components/clients";

export default function AddEntitiesPage() {
  return (
    <PageWrapper
      routePath="/client/entities"
      routeLabel="Entidades"
      subRoute="Nova Entidade"
      showSeparator={true}
    >
      <h1>Ola mundo add</h1>
      {/* <AddEntities /> */}
    </PageWrapper>
  );
}
