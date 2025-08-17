"use client";
import Link from "next/link";
import { TsunamiOnly } from "@/components/layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
  Button,
} from "@/components/ui";
import { ClientsTable } from "./entities-list/clients-table";
import { SuppliersTable } from "./entities-list/supliers-table";
import { StoresTable } from "./entities-list/stores-table";

export function EntitiesList() {
  return (
    <div className="p-6 space-y-6 ">
      <div>
        <h2 className="text-2xl text-center md:text-start">Entidades</h2>
        <p className="text-center text-muted-foreground md:text-start">
          Crie entidades que ajudaram no controlo das suas atividades.
        </p>
      </div>

      <Separator />

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

        <div className="mt-4" />

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
