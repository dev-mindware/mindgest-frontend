"use client";
import { useState } from "react";
import { TitleList } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { InvoiceForm, ProformaForm, ReceiptForm } from "./document-forms";
import { InvoiceCreatedModal } from "./Invoice-created-modal";

type TabsAloweds = "invoice-tab" | "receipt-tab" | "proform-tab";

export function AddDocuments() {
  const [currentTab, setCurrentTab] = useState<TabsAloweds>("invoice-tab");

  return (
    <div className="space-y-6">
      <TitleList
        title="Documentos"
        suTitle="Crie documentos que ajudaram no controlo das suas atividades."
      />

      <Tabs defaultValue={currentTab} className="w-full">
        <TabsList className="flex justify-center md:justify-start">
          <TabsTrigger
            value="invoice-tab"
            onClick={() => setCurrentTab("invoice-tab")}
          >
            Fatura Normal
          </TabsTrigger>
          <TabsTrigger
            value="receipt-tab"
            onClick={() => setCurrentTab("receipt-tab")}
          >
            Fatura Recibo
          </TabsTrigger>
          <TabsTrigger
            value="proform-tab"
            onClick={() => setCurrentTab("proform-tab")}
          >
            Fatura Proforma
          </TabsTrigger>
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

      <InvoiceCreatedModal type={currentTab} />
    </div>
  );
}
