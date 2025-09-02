"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { TitleList, TsunamiOnly } from "@/components/common";
import { StoreForm, SupplierForm, ClientForm } from "./entities-form";

export function AddEntities() {
  return (
    <div className="space-y-6">
      <TitleList
        title="Entidades"
        suTitle="Crie entidades que ajudaram no controlo das suas atividades."
      />

      <Tabs defaultValue="client-tab" className="w-full">
        <TabsList className="flex justify-center md:justify-start">
          <TabsTrigger value="client-tab">Cliente</TabsTrigger>
          <TsunamiOnly>
            <TabsTrigger value="supplier-tab">Fornecedor</TabsTrigger>
            <TabsTrigger value="store-tab">Loja</TabsTrigger>
          </TsunamiOnly>
        </TabsList>

        <TabsContent value="client-tab">
          <ClientForm />
        </TabsContent>
        <TabsContent value="supplier-tab">
          <SupplierForm />
        </TabsContent>
        <TabsContent value="store-tab">
          <StoreForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
