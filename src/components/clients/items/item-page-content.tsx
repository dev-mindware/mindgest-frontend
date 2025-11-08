"use client";
import { useState } from "react";
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

export function ItemsPageContent() {
  const [currentTab, setCurrentTab] = useState<ItemTab>("product");
  const { openModal, open } = useModal();

  const itemLabels: Record<ItemTab, string> = {
    product: "Produto",
    service: "Serviço",
  };

  const itemModals: Record<ItemTab, string> = {
    product: "add-product",
    service: "add-service",
  };

  const currentLabel = `Novo ${itemLabels[currentTab]}`;
  const currentModal = itemModals[currentTab];

  // fazer o seguinte: quando escolher produto ou serviço, redirecioznar para a pagina de criaçãoz
  return (
    <div className="space-y-6">
      <TitleList
        title="Produtos e Serviços"
        suTitle="Faça a gestão dos seus produtos e serviços listados."
      />

      <Tabs defaultValue="product-tab" className="w-full">
        <div className="flex items-center justify-between w-full">
          <TabsList className="flex justify-center md:justify-start">
            <TabsTrigger
              value="product-tab"
              onClick={() => setCurrentTab("product")}
            >
              Produtos
            </TabsTrigger>
            <TabsTrigger
              value="service-tab"
              onClick={() => setCurrentTab("service")}
            >
              Serviços
            </TabsTrigger>
          </TabsList>

          <Button onClick={() => openModal(currentModal)} variant="default">
            {currentLabel}
          </Button>
        </div>

        <TabsContent value="product-tab">
          <ProductList />
        </TabsContent>
        <TabsContent value="service-tab">
          <ServiceList />
        </TabsContent>
      </Tabs>

      {open["add-product"] && <AddProductModal />}
      {open["add-service"] && <ServiceModal action="add" />}
    </div>
  );
}
