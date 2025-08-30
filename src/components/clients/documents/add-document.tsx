"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { TitleList } from "@/components/layout";
import { InvoiceForm, ProformaForm, ReceiptForm } from "./document-forms";

export function AddDocuments() {
  return (
    <div className="space-y-6">
      <TitleList
        title="Documentos"
        suTitle="Crie documentos que ajudaram no controlo das suas atividades."
      />

      <Tabs defaultValue="invoice-tab" className="w-full">
        <TabsList className="flex justify-center md:justify-start">
          <TabsTrigger value="invoice-tab">Fatura Normal</TabsTrigger>
          <TabsTrigger value="receipt-tab">Fatura Recibo</TabsTrigger>
          <TabsTrigger value="proform-tab">Fatura Proforma</TabsTrigger>
        </TabsList>

        <TabsContent value="invoice-tab">
          <InvoiceForm />
        </TabsContent>
        <TabsContent value="receipt-tab">
          <ReceiptForm />
        </TabsContent>
        <TabsContent value="proform-tab">
          <ProformaForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
