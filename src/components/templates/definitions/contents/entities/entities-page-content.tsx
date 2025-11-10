"use client";
import { useState } from "react";
import { TitleList, TsunamiOnly } from "@/components/common";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
  Separator,
} from "@/components/ui";
import { useModal } from "@/stores";
import { ClientsList, ClientModal } from "./clients";
import { StoresList, AddStoreModal } from "./stores";
import { SuppliersList, AddSupplierModal } from "./suppliers";
import { toast } from "sonner";

type EntityTab = "client" | "supplier" | "store";

export function EntitiesPageContent() {
  const [currentTab, setCurrentTab] = useState<EntityTab>("client");
  const { openModal, open } = useModal();

  const entityLabels: Record<EntityTab, string> = {
    client: "Cliente",
    supplier: "Fornecedor",
    store: "Loja",
  };

  const entityModals: Record<EntityTab, string> = {
    client: "add-client",
    supplier: "add-supplier",
    store: "add-store",
  };

  const currentLabel = `Novo ${entityLabels[currentTab]}`;
  const currentModal = entityModals[currentTab];

  return (
    <div className="!p-4 sm:p-6 space-y-6">
      <TitleList
        title="Entidades"
        suTitle="Crie entidades que ajudarão no controlo das suas atividades"
      />
      <Separator />

      <Tabs defaultValue="client-tab" className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
          <TabsList className="flex flex-wrap justify-center sm:justify-start gap-2">
            <TabsTrigger
              value="client-tab"
              onClick={() => setCurrentTab("client")}
              className="text-sm sm:text-base"
            >
              Cliente
            </TabsTrigger>
            <TsunamiOnly>
              <TabsTrigger
                value="supplier-tab"
                onClick={() => setCurrentTab("supplier")}
                className="text-sm sm:text-base"
              >
                Fornecedor
              </TabsTrigger>
              <TabsTrigger
                value="store-tab"
                onClick={() => setCurrentTab("store")}
                className="text-sm sm:text-base"
              >
                Loja
              </TabsTrigger>
            </TsunamiOnly>
          </TabsList>

          <Button onClick={() => openModal(currentModal)} variant="default" className="w-full sm:w-auto text-sm sm:text-base">
            {currentLabel}
          </Button>
        </div>

        <div className="mt-4">
          <TabsContent value="client-tab">
            <ClientsList />
          </TabsContent>
          <TabsContent value="supplier-tab">
          <SuppliersList />
        </TabsContent>
        <TabsContent value="store-tab">
          <StoresList />
        </TabsContent>
        </div>
      </Tabs>

      <ClientModal action="add"  />
      {open["add-supplier"] && <AddSupplierModal />}
      {open["add-store"] && <AddStoreModal />}
    </div>
  );
}
