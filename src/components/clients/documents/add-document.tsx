"use client";
import { useCallback, useState } from "react";
import { TitleList } from "@/components/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import {
  InvoiceForm,
  InvoiceReceiptForm,
  ProformaForm,
} from "./document-forms";
import { useRouter, useSearchParams } from "next/navigation";

type TabsAloweds = "invoice" | "invoice-receipt" | "proform";

export function AddDocuments() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current_Tab = useSearchParams().get("tab");
  const [currentTab, setCurrentTab] = useState<TabsAloweds>(() => {
    if (current_Tab) {
      return current_Tab as TabsAloweds;
    }
    return "invoice";
  });

  const handleTabChange = useCallback(
    (value: TabsAloweds | string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", value);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="space-y-6">
      <TitleList
        title="Documentos"
        suTitle="Crie documentos que ajudaram no controlo das suas atividades."
      />

      <Tabs
        defaultValue={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="flex justify-center md:justify-start">
          <TabsTrigger value="invoice" onClick={() => setCurrentTab("invoice")}>
            Fatura
          </TabsTrigger>
          <TabsTrigger
            value="invoice-receipt"
            onClick={() => setCurrentTab("invoice-receipt")}
          >
            Fatura Recibo
          </TabsTrigger>
          <TabsTrigger value="proform" onClick={() => setCurrentTab("proform")}>
            Fatura Proforma
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoice">
          <InvoiceForm />
        </TabsContent>
        <TabsContent value="invoice-receipt">
          <InvoiceReceiptForm />
        </TabsContent>
        <TabsContent value="proform">
          <ProformaForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
