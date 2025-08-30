"use client";
import Link from "next/link";
import { TitleList } from "@/components/layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
} from "@/components/ui";
import { ReceiptsTable } from "./receipts-list";
import { ProformasTable } from "./invoice-proform";
import { InvoicesTable } from "./invoice-list";

export function DocumentList() {
  return (
    <div className="space-y-6">
      <TitleList
        title="Documentos"
        suTitle="Crie documentos que ajudaram no controlo das suas atividades"
      />

      <Tabs defaultValue="invoice-tab" className="w-full">
        <div className="w-full flex items-center justify-between">
          <TabsList className="flex justify-center md:justify-start">
            <TabsTrigger value="invoice-tab">Fatura Normal</TabsTrigger>
            <TabsTrigger value="receipt-tab">Fatura Recibo</TabsTrigger>
            <TabsTrigger value="proform-tab">Fatura Proforma</TabsTrigger>
          </TabsList>
          <Link href="/client/documents/new">
            <Button variant="default">Adicionar</Button>
          </Link>
        </div>

        <div className="mt-6" />

        <TabsContent value="invoice-tab">
          <div className="hidden w-full md:block">
            <InvoicesTable />
          </div>
        </TabsContent>
        <TabsContent value="proform-tab">
          <div className="hidden w-full md:block">
            <ProformasTable />
          </div>
        </TabsContent>
        <TabsContent value="receipt-tab">
          <div className="hidden w-full md:block">
            <ReceiptsTable />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
