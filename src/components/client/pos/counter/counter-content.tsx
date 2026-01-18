"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategorySelector } from "./products/category-selector";
import { ProductList } from "./products/product-list";
import { CartList } from "./cart/cart-list";
import {
  BarcodeProductScanner,
  MODAL_BARCODE_PRODUCT_ID,
} from "./modals/barcode-product-scanner";
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
import { Product } from "@/types";
import { itemsService } from "@/services/items-service";
import { toast } from "sonner";

interface CartItem extends Product {
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

  const [carts, setCarts] = useState<Record<CartType, Record<string, CartItem>>>({
    invoice: {},
    proforma: {},
  });

  const cartItems = carts[activeCart];

  // Barcode Scanner Logic
  const [barcodeBuffer, setBarcodeBuffer] = useState("");
  const [scannedProduct, setScannedProduct] = useState<Product | null>(
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
                category: product.category || "",
                quantity: product.quantity || product.reserved || 0,
                reserved: product.reserved,
                description: product.description,
                barcode: product.barcode,
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

    setCarts((prev) => {
      const currentCart = prev[activeCart];
      const existingItem = currentCart[scannedProduct.id];
      const newQty = (existingItem?.qty || 0) + quantity;

      return {
        ...prev,
        [activeCart]: {
          ...currentCart,
          [scannedProduct.id]: { ...scannedProduct, qty: newQty },
        },
      };
    });
  };

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
  };

  const handleAddToCart = (product: Product) => {
    setCarts((prev) => {
      const currentCart = prev[activeCart];
      const existingItem = currentCart[product.id];
      const newQty = (existingItem?.qty || 0) + 1;

      return {
        ...prev,
        [activeCart]: {
          ...currentCart,
          [product.id]: { ...product, qty: newQty },
        },
      };
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCarts((prev) => {
      const currentCart = prev[activeCart];
      const existingItem = currentCart[productId];
      if (!existingItem) return prev;

      const newQty = existingItem.qty - 1;

      const updatedCart = { ...currentCart };
      if (newQty <= 0) {
        delete updatedCart[productId];
      } else {
        updatedCart[productId] = { ...existingItem, qty: newQty };
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

    setCarts((prev) => {
      const currentCart = prev[activeCart];
      const existingItem = currentCart[productId];
      // If updating quantity for an item not in cart (shouldn't happen via UI logic usually),
      // we can't update it without product details.
      // Assuming this is called for items ALREADY in cart.
      if (!existingItem) return prev;

      return {
        ...prev,
        [activeCart]: {
          ...currentCart,
          [productId]: { ...existingItem, qty: quantity },
        },
      };
    });
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
    quantity: p.quantity || p.reserved || 0, // Map quantity, fallback to reserved if backend mismatch
    reserved: p.reserved || 0,
    description: p.description,
    barcode: p.barcode,
    sku: p.sku,
  }));

  const getCartItemsArray = (type: CartType): CartItem[] => {
    const items = carts[type];
    return Object.values(items);
  };

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
              <CartList
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
              <CartList
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
