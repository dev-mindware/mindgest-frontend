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
import { ManagerList, ManagerModal } from "./manager";

type CollaboratorTab = "manager" | "cashier";

export function CollaboratorsPageContent() {
  const [currentTab, setCurrentTab] = useState<CollaboratorTab>("manager");
  const { openModal } = useModal();

  const entityLabels: Record<CollaboratorTab, string> = {
    manager: "Gerente",
    cashier: "Caixa",
  };

  const entityModals: Record<CollaboratorTab, string> = {
    manager: "add-manager",
    cashier: "add-cashier",
  };

  const currentLabel = `Novo ${entityLabels[currentTab]}`;
  const currentModal = entityModals[currentTab];

  return (
    <div className="!py-4 sm:p-6 space-y-6">
      <TitleList
        title="Colaboradores"
        suTitle="Crie colaboradores que ajudarão no controlo das suas atividades"
      />
      <Separator />

      <Tabs defaultValue="manager-tab" className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
          <TabsList className="flex flex-wrap justify-center sm:justify-start gap-2">
            <TabsTrigger
              value="manager-tab"
              onClick={() => setCurrentTab("manager")}
              className="text-sm sm:text-base"
            >
              Gerente
            </TabsTrigger>
            <TsunamiOnly>
            <TabsTrigger
              value="cashier-tab"
              onClick={() => setCurrentTab("cashier")}
              className="text-sm sm:text-base"
            >
              Caixa
            </TabsTrigger>
            </TsunamiOnly>
          </TabsList>

          <Button
            onClick={() => openModal(currentModal)}
            variant="default"
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            {currentLabel}
          </Button>
        </div>

        <div className="mt-4">
          <TabsContent value="manager-tab">
            <ManagerList />
          </TabsContent>
          <TabsContent value="cashier-tab">
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm sm:text-base">
              Nenhum caixa cadastrado ainda.
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <ManagerModal action="add" />
    </div>
  );
}