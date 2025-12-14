"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TitleList } from "@/components/common";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
} from "@/components/ui";
import {
  InvoiceReceiptList,
  InvoiceList,
  ReceiptList,
  ProformaList,
} from "./lists";

type DocumentTab =
  | "invoice"
  | "invoice-receipt"
  | "proforma"
  | "only-receipt"
  | "credit-note";

export function DocumentList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as DocumentTab) ?? "invoice";

  const handleTabChange = useCallback(
    (value: DocumentTab | string) => {
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
        suTitle="Crie documentos que ajudaram no controlo das suas atividades"
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="invoice">Fatura Normal</TabsTrigger>
            <TabsTrigger value="invoice-receipt">Fatura Recibo</TabsTrigger>
            <TabsTrigger value="proforma">Fatura Proforma</TabsTrigger>
            <TabsTrigger value="only-receipt">Recibos</TabsTrigger>
            <TabsTrigger value="credit-note">Notas</TabsTrigger>
          </TabsList>

          <Link href={`/client/documents/new?tab=${activeTab}`}>
            <Button>Criar Documento</Button>
          </Link>
        </div>

        <TabsContent value="invoice">
          <InvoiceList />
        </TabsContent>

        <TabsContent value="proforma">
          <ProformaList />
        </TabsContent>

        <TabsContent value="invoice-receipt">
          <InvoiceReceiptList />
        </TabsContent>

        <TabsContent value="only-receipt">
          <ReceiptList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
