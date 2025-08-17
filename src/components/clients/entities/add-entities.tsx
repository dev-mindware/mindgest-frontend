"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
} from "@/components/ui";
import { TsunamiOnly } from "@/components/layout";
import { StoreForm, SupplierForm, ClientForm } from "./entities-form";

export function AddEntities() {
  return (
    <div className="px-4 space-y-6">
      <div>
        <h2 className="text-2xl text-center md:text-start">Entidades</h2>
        <p className="text-center text-muted-foreground md:text-start">
          Crie entidades que ajudaram no controlo das suas atividades.
        </p>
      </div>

      <Separator />

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
