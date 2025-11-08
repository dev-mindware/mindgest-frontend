"use client";
import { useState } from "react";
import { TitleList, TsunamiOnly } from "@/components/common";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
} from "@/components/ui";
import { useModal } from "@/stores";
import { ClientsList, AddClientModal } from "./clients";
import { StoresList, AddStoreModal } from "./stores";
import { SuppliersList, AddSupplierModal } from "./suppliers";

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
    <div className="space-y-6">
      <TitleList
        title="Entidades"
        suTitle="Crie entidades que ajudarão no controlo das suas atividades"
      />

      <Tabs defaultValue="client-tab" className="w-full">
        <div className="flex items-center justify-between w-full">
          <TabsList className="flex justify-center md:justify-start">
            <TabsTrigger
              value="client-tab"
              onClick={() => setCurrentTab("client")}
            >
              Cliente
            </TabsTrigger>
            <TsunamiOnly>
              <TabsTrigger
                value="supplier-tab"
                onClick={() => setCurrentTab("supplier")}
              >
                Fornecedor
              </TabsTrigger>
              <TabsTrigger
                value="store-tab"
                onClick={() => setCurrentTab("store")}
              >
                Loja
              </TabsTrigger>
            </TsunamiOnly>
          </TabsList>

          <Button onClick={() => openModal(currentModal)} variant="default">
            {currentLabel}
          </Button>
        </div>

        <TabsContent value="client-tab">
          <ClientsList />
        </TabsContent>
        <TabsContent value="supplier-tab">
          <SuppliersList />
        </TabsContent>
        <TabsContent value="store-tab">
          <StoresList />
        </TabsContent>
      </Tabs>

      {open["add-client"] && <AddClientModal />}
      {open["add-supplier"] && <AddSupplierModal />}
      {open["add-store"] && <AddStoreModal />}
    </div>
  );
}
