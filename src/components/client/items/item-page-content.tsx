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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components";
import {
  AddProductModal,
  ProductList,
  ServiceList,
  ServiceModal,
} from "@/components/client";
import { useModal } from "@/stores";
import { ChevronDown, Plus, Barcode, Keyboard } from "lucide-react";
import { BarcodeScannerModal, BARCODE_SCANNER_MODAL_ID } from "./products/product-modals/barcode-scanner-modal";
import { FeatureGate } from "@/components";

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
        title={activeTab === "product" ? "Produtos" : "Serviços"}
        suTitle={`Faça a gestão dos seus ${activeTab === "product" ? "produtos" : "serviços"
          } listados.`}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="product">Produtos</TabsTrigger>
            <TabsTrigger value="service">Serviços</TabsTrigger>
          </TabsList>

          {activeTab === "product" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Produto
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => openModal("add-product")}
                  className="flex items-center gap-2"
                >
                  <Keyboard className="h-4 w-4" />
                  Manual
                </DropdownMenuItem>
                <FeatureGate minPlan="Pro" fallback="disabled">
                  <DropdownMenuItem
                    onClick={() => openModal(BARCODE_SCANNER_MODAL_ID)}
                    className="flex items-center gap-2"
                  >
                    <Barcode className="h-4 w-4" />
                    Código de Barra
                  </DropdownMenuItem>
                </FeatureGate>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => openModal(TAB_MODALS[activeTab])}>
              {`Novo ${TAB_LABELS[activeTab]}`}
            </Button>
          )}
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
      <BarcodeScannerModal />
    </div>
  );
}
