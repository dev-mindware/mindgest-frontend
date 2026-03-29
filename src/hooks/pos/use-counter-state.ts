"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, CartItem, CartType } from "@/types";
import { itemsService } from "@/services/items-service";

interface UseCounterStateProps {
  apiProducts: Product[];
  activeCart: CartType;
}

export function useCounterState({
  apiProducts,
  activeCart,
}: UseCounterStateProps) {
  const [carts, setCarts] = useState<
    Record<CartType, Record<string, CartItem>>
  >({
    invoice: {},
    proforma: {},
  });

  const cartItems = carts[activeCart];

  // Barcode Scanner Logic
  const [barcodeBuffer, setBarcodeBuffer] = useState("");
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);

  const handleAddToCart = useCallback(
    (product: Product, quantity: number = 1) => {
      setCarts((prev) => {
        const currentCart = prev[activeCart];
        const existingItem = currentCart[product.id];

        if (existingItem) {
          const newQty = existingItem.qty + quantity;
          const updatedCart = {
            ...currentCart,
            [product.id]: { ...existingItem, qty: newQty },
          };
          return { ...prev, [activeCart]: updatedCart };
        } else {
          const newItem: CartItem = {
            ...product,
            qty: quantity,
          };
          return {
            ...prev,
            [activeCart]: { ...currentCart, [product.id]: newItem },
          };
        }
      });
    },
    [activeCart],
  );

  const handleManualScan = useCallback(
    async (barcode: string) => {
      let product = apiProducts.find(
        (p) => String(p.barcode) === barcode || p.sku === barcode,
      );

      if (!product) {
        try {
          const barcodeData = await itemsService.checkBarcode(barcode);
          if (barcodeData) {
            product = {
              id: barcodeData.id,
              name: barcodeData.name,
              price: barcodeData.price || 0,
              image: barcodeData.image,
              category: barcodeData.category || "",
              quantity: barcodeData.quantity || 0,
              reserved: barcodeData.reserved || 0,
              description: barcodeData.description,
              barcode: String(barcodeData.barcode),
              sku: barcodeData.sku,
              tax: barcodeData.tax,
            } as any;
          }
        } catch (error) {
          console.error("Error fetching product by barcode:", error);
        }
      }

      if (product) {
        setScannedProduct(product);
      }
    },
    [apiProducts, handleAddToCart],
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
          const barcode = barcodeBuffer;
          setBarcodeBuffer("");
          await handleManualScan(barcode);
        }
      } else if (e.key.length === 1) {
        setBarcodeBuffer((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [barcodeBuffer, handleManualScan]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (barcodeBuffer) {
        setBarcodeBuffer("");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [barcodeBuffer]);

  const onConfirmScan = (quantity: number = 1) => {
    if (scannedProduct) {
      handleAddToCart(scannedProduct, quantity);
      setScannedProduct(null);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCarts((prev) => {
      const currentCart = prev[activeCart];
      const existingItem = currentCart[productId];

      if (!existingItem) return prev;

      const newQty = existingItem.qty - 1;

      if (newQty <= 0) {
        const { [productId]: _, ...rest } = currentCart;
        return { ...prev, [activeCart]: rest };
      } else {
        const updatedCart = {
          ...currentCart,
          [productId]: { ...existingItem, qty: newQty },
        };
        return { ...prev, [activeCart]: updatedCart };
      }
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

  const handleClearCart = (type: CartType) => {
    setCarts((prev) => ({
      ...prev,
      [type]: {},
    }));
  };

  const getCartItemsArray = (type: CartType): CartItem[] => {
    const items = carts[type];
    return Object.values(items);
  };

  return {
    carts,
    cartItems,
    barcodeBuffer,
    scannedProduct,
    onConfirmScan,
    handleAddToCart,
    handleRemoveFromCart,
    handleDeleteItem,
    handleUpdateQuantity,
    handleClearCart,
    getCartItemsArray,
    handleManualScan,
  };
}
