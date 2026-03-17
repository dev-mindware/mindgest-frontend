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
import { ProformaList, InvoiceReceiptList, CreditNotesList } from "@/components";
import { currentStoreStore } from "@/stores";

type DocumentTab =
  | "invoice-receipt"
  | "proforma"
  | "credit-notes";

export function MovementsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentStore } = currentStoreStore();
  const activeTab = (searchParams.get("tab") as DocumentTab) ?? "invoice-receipt";

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
        title="Movimentos"
        suTitle="Controle todos os movimentos realizados na sua empresa"
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Scrollable tabs on mobile */}
          <div className="overflow-x-auto">
            <TabsList className="w-full sm:w-auto inline-flex">
              <TabsTrigger value="invoice-receipt" className="whitespace-nowrap" defaultChecked>
                Factura Recibo
              </TabsTrigger>
              <TabsTrigger value="proforma" className="whitespace-nowrap">
                Proforma
              </TabsTrigger>
              <TabsTrigger value="credit-notes" className="whitespace-nowrap">
                Notas de Crédito
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="invoice-receipt">
          <InvoiceReceiptList storeId={currentStore?.id} />
        </TabsContent>

        <TabsContent value="proforma">
          <ProformaList storeId={currentStore?.id} />
        </TabsContent>

        <TabsContent value="credit-notes">
          <CreditNotesList storeId={currentStore?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
