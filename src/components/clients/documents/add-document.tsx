"use client";
import { useState } from "react";
import { TitleList } from "@/components/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { InvoiceForm, InvoiceReceiptForm, ProformaForm } from "./document-forms";
import { useSearchParams } from "next/navigation";

type TabsAloweds = "invoice-tab" | "invoice-receipt-tab" | "proform-tab";

export function AddDocuments() {
  const invoice = useSearchParams().get("invoice");
  const current_Tab = useSearchParams().get("current_tab");
  const [currentTab, setCurrentTab] = useState<TabsAloweds>(() => {
    if (current_Tab) {
      return current_Tab as TabsAloweds;
    }
    return "invoice-tab";
  });

  return (
    <div className="space-y-6">
      <TitleList
        title="Documentos"
        suTitle="Crie documentos que ajudaram no controlo das suas atividades."
      />
      <code>

        {JSON.stringify(JSON.parse(invoice as string), null, 2)}
      </code>

      <Tabs defaultValue={currentTab} className="w-full">
        <TabsList className="flex justify-center md:justify-start">
          <TabsTrigger
            value="invoice-tab"
            onClick={() => setCurrentTab("invoice-tab")}
          >
            Fatura
          </TabsTrigger>
          <TabsTrigger
            value="invoice-receipt-tab"
            onClick={() => setCurrentTab("invoice-receipt-tab")}
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
        <TabsContent value="invoice-receipt-tab">
          <InvoiceReceiptForm />
        </TabsContent>
        <TabsContent value="proform-tab">
          <ProformaForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
