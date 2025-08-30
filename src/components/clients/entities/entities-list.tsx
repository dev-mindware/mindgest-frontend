"use client";
import Link from "next/link";
import { TitleList, TsunamiOnly } from "@/components/layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
} from "@/components/ui";
import { ClientsTable } from "./entities-list/clients-table";
import { SuppliersTable } from "./entities-list/supliers-table";
import { StoresTable } from "./entities-list/stores-table";

export function EntitiesList() {
  return (
    <div className="space-y-6">
      <TitleList
        title="Entidades"
        suTitle="Crie entidades que ajudaram no controlo das suas atividades"
      />

      <Tabs defaultValue="client-tab" className="w-full">
        <div className="w-full flex items-center justify-between">
          <TabsList className="flex justify-center md:justify-start">
            <TabsTrigger value="client-tab">Cliente</TabsTrigger>
            <TsunamiOnly>
              <TabsTrigger value="supplier-tab">Fornecedor</TabsTrigger>
              <TabsTrigger value="store-tab">Loja</TabsTrigger>
            </TsunamiOnly>
          </TabsList>
          <Link href="/client/entities/new">
            <Button variant="default">Adicionar</Button>
          </Link>
        </div>

        <TabsContent value="client-tab">
          <div className="hidden w-full md:block">
            <ClientsTable />
          </div>
        </TabsContent>
        <TabsContent value="supplier-tab">
          <div className="hidden w-full md:block">
            <SuppliersTable />
          </div>
        </TabsContent>
        <TabsContent value="store-tab">
          <div className="hidden w-full md:block">
            <StoresTable />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
