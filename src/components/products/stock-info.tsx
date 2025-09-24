import { useMemo } from "react";
import { TsunamiOnly } from "../common";
import {  ItemResponse as Product } from "@/types";

export const StockInfo = ({ product }: { product: Product }) => {
  const formattedExpiryDate = useMemo(() => {
    return product.expiryDate?.toString().slice(0, 10);
  }, [product.expiryDate]);

  return (
    <TsunamiOnly>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {product.maxStock} no Stock - {product.maxStock}
        </span>
        <span>Expira em: ({formattedExpiryDate})</span>
      </div>
    </TsunamiOnly>
  );
};
