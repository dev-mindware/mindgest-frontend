"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  TitleList,
} from "@/components";
import {
  AddProductModal,
  ProductList,
  ServiceList,
  ServiceModal,
} from "@/components/clients";
import { useModal } from "@/stores";

type ItemTab = "product" | "service";

const TAB_LABELS: Record<ItemTab, string> = {
  product: "Produto",
  service: "Serviço",
};

const TAB_MODALS: Record<ItemTab, string> = {
  product: "add-product",
  service: "add-service",
};

export function ItemsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openModal, open } = useModal();
  const activeTab = (searchParams.get("tab") as ItemTab) ?? "product";

  const handleTabChange = useCallback(
    (value: ItemTab | string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", value);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="space-y-6">
      <TitleList
        title="Produtos e Serviços"
        suTitle="Faça a gestão dos seus produtos e serviços listados."
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="product">Produtos</TabsTrigger>
            <TabsTrigger value="service">Serviços</TabsTrigger>
          </TabsList>

          <Button onClick={() => openModal(TAB_MODALS[activeTab])}>
            {`Novo ${TAB_LABELS[activeTab]}`}
          </Button>
        </div>

        <TabsContent value="product">
          <ProductList />
        </TabsContent>

        <TabsContent value="service">
          <ServiceList />
        </TabsContent>
      </Tabs>

      {open["add-product"] && <AddProductModal />}
      {open["add-service"] && <ServiceModal action="add" />}
    </div>
  );
}
