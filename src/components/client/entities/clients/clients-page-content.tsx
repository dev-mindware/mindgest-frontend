import { TitleList } from "@/components/common";
import { ClientModal, ClientsList } from "@/components";

export function ClientsPageContent() {
  return (
    <div className="!py-4 sm:p-6 space-y-6">
      <TitleList title="Clientes" suTitle="Adicione e gerencie seus clientes" />

      <div className="mt-4">
        <ClientsList />
      </div>

      <ClientModal action="add" />
    </div>
  );
}
