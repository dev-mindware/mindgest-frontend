"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategorySection, ProductSection, CartSection } from "./counter-comps";
import {
  BarcodeProductModal,
  MODAL_BARCODE_PRODUCT_ID,
} from "./counter-comps/barcode-product-modal";
import { useModal } from "@/stores/modal/use-modal-store";
import { useGetCategories } from "@/hooks/category";
import { useGetItems } from "@/hooks/stock";
import { useQueryState } from "nuqs";
import {
  PosCategorySkeleton,
  PosProductSectionSkeleton,
  PosCartSkeleton,
} from "@/components/common/skeletons";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { playScannerBeep } from "@/utils/audio";
import { ProductMock } from "./counter-comps/data";
import { itemsService } from "@/services/items-service";
import { toast } from "sonner";

interface CartItem extends ProductMock {
  qty: number;
}

type CartType = "invoice" | "proforma";

export function CounterContent() {
  const [search] = useQueryState("search", { defaultValue: "" });
  const { categories, isLoading: isLoadingCategories } = useGetCategories();
  const [activeCart, setActiveCart] = useState<CartType>("invoice");
  const { openModal } = useModal();

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

  const [carts, setCarts] = useState<Record<CartType, Record<string, number>>>({
    invoice: {},
    proforma: {},
  });

  const cartItems = carts[activeCart];

  // Barcode Scanner Logic
  const [barcodeBuffer, setBarcodeBuffer] = useState("");
  const [scannedProduct, setScannedProduct] = useState<ProductMock | null>(
    null,
  );

  useEffect(() => {
    const handleGlobalKeyDown = async (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "Enter") {
        if (barcodeBuffer) {
          try {
            const barcode = barcodeBuffer;
            const product = await itemsService.checkBarcode(barcode);

            if (product) {
              setScannedProduct({
                id: product.id,
                name: product.name,
                price: Number(product.price || 0),
                image: product.image,
                category: product.category || "", // Assuming BarCode has category name string, adjust if needed
                reserved: product.reserved,
                description: product.description,
                barcode: product.barcode, // Ensure string
                sku: product.sku,
              });

              playScannerBeep();
              openModal(MODAL_BARCODE_PRODUCT_ID);
            }
          } catch (error) {
            console.error("Product not found for barcode:", barcodeBuffer);
            toast.error("Produto não encontrado");
          }
          setBarcodeBuffer("");
        }
      } else if (/^[0-9]$/.test(e.key)) {
        setBarcodeBuffer((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [barcodeBuffer, apiProducts]);

  const onConfirmScan = (quantity: number) => {
    if (!scannedProduct) return;

    setCarts((prev) => ({
      ...prev,
      [activeCart]: {
        ...prev[activeCart],
        [scannedProduct.id]:
          (prev[activeCart][scannedProduct.id] || 0) + quantity,
      },
    }));
  };

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
  };

  const handleAddToCart = (product: ProductMock) => {
    setCarts((prev) => ({
      ...prev,
      [activeCart]: {
        ...prev[activeCart],
        [product.id]: (prev[activeCart][product.id] || 0) + 1,
      },
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCarts((prev) => {
      const currentCart = prev[activeCart];
      const newQty = (currentCart[productId] || 0) - 1;

      const updatedCart = { ...currentCart };
      if (newQty <= 0) {
        delete updatedCart[productId];
      } else {
        updatedCart[productId] = newQty;
      }

      return { ...prev, [activeCart]: updatedCart };
    });
  };

  const handleDeleteItem = (productId: string) => {
    setCarts((prev) => {
      const { [productId]: _, ...rest } = prev[activeCart];
      return { ...prev, [activeCart]: rest };
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleDeleteItem(productId);
      return;
    }
    setCarts((prev) => ({
      ...prev,
      [activeCart]: {
        ...prev[activeCart],
        [productId]: quantity,
      },
    }));
  };

  const currentCategoryName = categories.find(
    (c) => c.id === selectedCategory,
  )?.name;

  const products: ProductMock[] = (apiProducts as any[]).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price || 0,
    image: p.image,
    category: p.category?.name || "",
    reserved: p.reserved || 0,
    description: p.description,
    barcode: p.barcode,
    sku: p.sku,
  }));

  const getCartItemsArray = (type: CartType): CartItem[] => {
    const items = carts[type];
    return Object.keys(items)
      .map((id) => {
        const product = products.find((p) => p.id === id);
        return product ? { ...product, qty: items[id] } : null;
      })
      .filter((i): i is CartItem => i !== null);
  };

  return (
    <div className="flex h-full overflow-hidden">
      <BarcodeProductModal product={scannedProduct} onConfirm={onConfirmScan} />
      <div className="flex-1 flex flex-col min-w-0 gap-4 p-4">
        {isLoadingCategories ? (
          <PosCategorySkeleton />
        ) : (
          <CategorySection
            categories={categories.map((c) => ({
              id: c.id,
              name: c.name,
              count: c.itemsCount,
            }))}
            selectedCategory={selectedCategory}
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
            <ProductSection
              products={products}
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          )}
        </ScrollArea>
      </div>

      {/* Right Content - Cart & Payment */}
      <div className="w-[450px] border-l border-border/50 backdrop-blur-sm">
        <Tabs
          value={activeCart}
          onValueChange={(v) => setActiveCart(v as CartType)}
          className="h-full flex flex-col"
        >
          <div className="px-6 pt-4 flex items-center justify-between">
            <TabsList>
              <TabsTrigger
                value="invoice"
                className="text-xs tracking-wider font-semibold"
              >
                Factura
              </TabsTrigger>
              <TabsTrigger
                value="proforma"
                className="text-xs tracking-wider font-semibold"
              >
                Proforma
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="invoice" className="flex-1 mt-0">
            {isLoadingCategories ? (
              <PosCartSkeleton />
            ) : (
              <CartSection
                type="invoice"
                cartItems={getCartItemsArray("invoice")}
                onUpdateQty={(item, delta) =>
                  handleUpdateQuantity(item.id, item.qty + delta)
                }
                onRemove={(id) => handleRemoveFromCart(id)}
                onDelete={(id) => handleDeleteItem(id)}
              />
            )}
          </TabsContent>

          <TabsContent value="proforma" className="flex-1 mt-0">
            {isLoadingCategories ? (
              <PosCartSkeleton />
            ) : (
              <CartSection
                type="proforma"
                cartItems={getCartItemsArray("proforma")}
                onUpdateQty={(item, delta) =>
                  handleUpdateQuantity(item.id, item.qty + delta)
                }
                onRemove={(id) => handleRemoveFromCart(id)}
                onDelete={(id) => handleDeleteItem(id)}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
