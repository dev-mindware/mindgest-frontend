"use client"
import { TitleList } from "@/components/common";
import { SupplierModal, SuppliersList } from "@/components";
import { ButtonAddSupplier } from "./button-add-supplier";

export function SuppliersPageContent() {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <TitleList
          title="Fornecedores"
          suTitle="Adicione e gerencie seus fornecedores"
        />
        <ButtonAddSupplier />
      </div>
      <SuppliersList />
      <SupplierModal />
    </>
  );
}
