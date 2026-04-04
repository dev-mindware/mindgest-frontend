"use client";
import { TitleList } from "@/components/common";
import { Button, Separator } from "@/components/ui";
import { useModal } from "@/stores";
import { StoresList, StoreModal } from ".";

export function StoresPageContent() {
  const { openModal, open } = useModal();

  return (
    <div className="!py-4 sm:p-6 space-y-6">
      <TitleList
        title="Lojas"
        suTitle="Crie lojas para o controlo das suas atividades"
      />
      <Separator />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
        <Button
          onClick={() => openModal("add-store")}
          variant="default"
          className="w-full sm:w-auto text-sm sm:text-base"
        >
          Nova Loja
        </Button>
      </div>

      <div className="mt-4">
        <StoresList />
      </div>

      {open["add-store"] && <StoreModal action="add" />}
    </div>
  );
}
