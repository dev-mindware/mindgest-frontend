"use client";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  TitleList,
} from "@/components";
import { AddProduct, ProductList } from "@/components/products";
import { AddService, ServiceList } from "@/components/services";
import { useModal } from "@/stores";
import { useState } from "react";

export function Items() {
  const { openModal } = useModal();
  const [currentTab, setCurrentTab] = useState<"product" | "service">(
    "product"
  );

  const currentModal = currentTab === "product" ? "add-product" : "add-service";
  const currentLabel =
    currentTab === "product" ? "Novo produto" : "Novo serviço";

  return (
    <div className="space-y-6">
      <TitleList
        title="Produtos e Serviços"
        suTitle="Faça a Gestão dos seus produtos e serviços listados."
      />

      <Tabs defaultValue="product-tab" className="w-full bg-red-">
        <div className="w-full flex items-center justify-between">
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
          <div className="flex justify-end mb-4">
            <Button onClick={() => openModal(currentModal)}>
              {currentLabel}
            </Button>
          </div>
        </div>

        <TabsContent value="product-tab">
          <ProductList />
        </TabsContent>
        <TabsContent value="service-tab">
          <ServiceList />
        </TabsContent>
      </Tabs>
      {currentModal === "add-product" && <AddProduct />}
      {currentModal === "add-service" && <AddService />}
    </div>
  );
}