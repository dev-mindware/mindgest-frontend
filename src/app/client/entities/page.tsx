import { PageWrapper } from "@/components";
import { EntitiesList } from "@/components/clients";

export default function Page() {
  return (
    <PageWrapper subRoute="Entidades">
      <EntitiesList />
    </PageWrapper>
  );
}
