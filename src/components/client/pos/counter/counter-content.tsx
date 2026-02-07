"use client";

import { useState, useEffect } from "react";
import { CategorySelector, ProductList } from "./products";
import { CartList } from "./cart";
import {
  BarcodeProductScanner,
  MODAL_BARCODE_PRODUCT_ID,
} from "./modals";
import { useModal, currentStoreStore } from "@/stores";
import { useGetCategories, useGetItems, useGetCurrentSession } from "@/hooks";
import { useQueryState } from "nuqs";
import {
  PosCategorySkeleton,
  PosProductSectionSkeleton,
  PosCartSkeleton,
  Tabs, TabsContent, TabsList, TabsTrigger,
  ScrollArea
} from "@/components";
import { Product, CartType } from "@/types";
import { useCounterState } from "@/hooks";

export function CounterContent() {
  const [search] = useQueryState("search", { defaultValue: "" });
  const { categories, isLoading: isLoadingCategories } = useGetCategories();
  const [activeCart, setActiveCart] = useState<CartType>("invoice");
  const { openModal } = useModal();
  const { currentStore } = currentStoreStore();
  const { data: currentSession } = useGetCurrentSession(currentStore?.id);

  // Default to the first category if available
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const { items: apiProducts, isLoading: isLoadingProducts } = useGetItems({
    search: search || undefined,
    categoryId: selectedCategory || undefined,
    type: "PRODUCT",
    limit: 100,
  });

  // Use custom hook for cart state management
  const {
    scannedProduct,
    onConfirmScan,
    handleAddToCart,
    handleRemoveFromCart,
    handleDeleteItem,
    handleUpdateQuantity,
    handleClearCart,
    getCartItemsArray,
  } = useCounterState({ apiProducts, activeCart });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const currentCategoryName = categories.find(
    (c) => c.id === selectedCategory,
  )?.name;

  const products: Product[] = (apiProducts as any[]).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price || 0,
    image: p.image,
    category: p.category?.name || "",
    quantity: p.quantity || p.reserved || 0,
    reserved: p.reserved || 0,
    description: p.description,
    barcode: p.barcode,
    sku: p.sku,
    tax: p.tax, // ✅ Preserve tax data from API
  }));

  return (
    <div className="flex h-full overflow-hidden">
      <BarcodeProductScanner
        scannedProduct={scannedProduct}
        onConfirm={onConfirmScan}
      />
      <div className="flex-1 flex flex-col min-w-0 gap-4 p-4">
        {isLoadingCategories ? (
          <PosCategorySkeleton />
        ) : (
          <CategorySelector
            categories={categories}
            activeCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {currentCategoryName || "Todos"}
          </h2>
        </div>

        <ScrollArea className="flex-1 pb-4">
          {isLoadingProducts ? (
            <PosProductSectionSkeleton />
          ) : (
            <ProductList
              products={products}
              cartItems={getCartItemsArray(activeCart).reduce((acc, item) => {
                acc[item.id] = item;
                return acc;
              }, {} as Record<string, any>)}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          )}
        </ScrollArea>
      </div>

      {/* Right Content - Cart & Payment */}
      <div className="w-[400px] flex flex-col border-l border-border/50 bg-sidebar/30">
        <Tabs value={activeCart} onValueChange={(v) => setActiveCart(v as CartType)} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
            <TabsTrigger value="invoice">Faturação</TabsTrigger>
            <TabsTrigger value="proforma">Proforma</TabsTrigger>
          </TabsList>

          <TabsContent value="invoice" className="flex-1 mt-0">
            {isLoadingCategories || !currentSession?.id ? (
              <PosCartSkeleton />
            ) : (
              <CartList
                type="invoice"
                cartItems={getCartItemsArray("invoice")}
                onUpdateQty={(item, delta) =>
                  handleUpdateQuantity(item.id, item.qty + delta)
                }
                onRemove={(id) => handleRemoveFromCart(id)}
                onDelete={(id) => handleDeleteItem(id)}
                onClearCart={() => handleClearCart("invoice")}
                cashSessionId={currentSession.id}
              />
            )}
          </TabsContent>

          <TabsContent value="proforma" className="flex-1 mt-0">
            {isLoadingCategories || !currentSession?.id ? (
              <PosCartSkeleton />
            ) : (
              <CartList
                type="proforma"
                cartItems={getCartItemsArray("proforma")}
                onUpdateQty={(item, delta) =>
                  handleUpdateQuantity(item.id, item.qty + delta)
                }
                onRemove={(id) => handleRemoveFromCart(id)}
                onDelete={(id) => handleDeleteItem(id)}
                onClearCart={() => handleClearCart("proforma")}
                cashSessionId={currentSession.id}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}