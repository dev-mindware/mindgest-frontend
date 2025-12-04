"use client";
import Link from "next/link";
import { TitleList } from "@/components/common";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
} from "@/components/ui";
import { InvoiceReceiptList, InvoiceList, ReceiptList, ProformaList } from "./lists";



export function DocumentList() {
  return (
    <div className="space-y-6">
      <TitleList
        title="Documentos"
        suTitle="Crie documentos que ajudaram no controlo das suas atividades"
      />

      <Tabs defaultValue="invoice-tab" className="w-full">
        <div className="flex items-center justify-between w-full">
          <TabsList className="flex justify-center md:justify-start">
            <TabsTrigger value="invoice-tab">Fatura Normal</TabsTrigger>
            <TabsTrigger value="invoice-receipt-tab">Fatura Recibo</TabsTrigger>
            <TabsTrigger value="proform-tab">Fatura Proforma</TabsTrigger>
            <TabsTrigger value="only-receipt-tab">Recibos</TabsTrigger>
          </TabsList>
          <Link href="/client/documents/new">
            <Button variant="default">Criar Documento</Button>
          </Link>
        </div>

        <div className="mt-6" />

        <TabsContent value="invoice-tab">
          <div className="hidden w-full md:block">
            <InvoiceList />
          </div>
        </TabsContent>
        <TabsContent value="proform-tab">
          <div className="hidden w-full md:block">
            <ProformaList />
          </div>
        </TabsContent>
        <TabsContent value="invoice-receipt-tab">
          <div className="hidden w-full md:block">
            <InvoiceReceiptList />
          </div>
        </TabsContent>
        <TabsContent value="only-receipt-tab">
          <div className="hidden w-full md:block">
            <ReceiptList />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
