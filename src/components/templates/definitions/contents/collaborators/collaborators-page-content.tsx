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
import { CollaboratorList } from "./collaborator-list";
import { CollaboratorModal } from "./collaborator-modals";

export function CollaboratorsPageContent() {
  const { openModal } = useModal();

  return (
    <div className="!py-4 sm:p-6 space-y-6">
      <TitleList
        title="Colaboradores"
        suTitle="Crie colaboradores que ajudarão no controlo das suas atividades"
      />
      <Separator />

          <Button
            onClick={() => openModal("add-collaborator")}
            variant="default"
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            Adicionar Colaborador
          </Button>

        <div className="mt-4">
            <CollaboratorList />
        </div>

      <CollaboratorModal action="add" />
    </div>
  );
}