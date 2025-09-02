import { useMemo } from "react";
import { TsunamiOnly } from "../common";
import { Product } from "@/types";

export const StockInfo = ({ product }: { product: Product }) => {
  const formattedExpiryDate = useMemo(() => {
    return product.expirydate?.toString().slice(0, 10);
  }, [product.expirydate]);

  return (
    <TsunamiOnly>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {product.stock} no Stock - {product.location}
        </span>
        <span>Expira em: ({formattedExpiryDate})</span>
      </div>
    </TsunamiOnly>
  );
};
