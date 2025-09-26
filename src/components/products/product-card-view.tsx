"use client";
import { useProductActions } from "@/hooks";
import { ItemResponse } from "@/types";
import { formatCurrency, formatPrice } from "@/utils";
import { ProductIcon } from "./product-icon";
import { ProductTitle } from "./product-title";
import { StatusBadge } from "./product-status-badge";
import { ProductDetails } from "./product-details";
import { Card, CardContent, CardHeader, ButtonOnlyAction } from "@/components";
import { StockInfo } from "./stock-info";

interface ProductCardProps {
  product: ItemResponse;
}

export function ProductCardView({ product }: ProductCardProps) {
  const { handlerDeleteProduct, handlerDetailsProduct, handlerEditProduct } =
    useProductActions();

  return (
    <Card className="relative overflow-hidden transition-shadow duration-200 border border-border bg-card hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <ProductIcon />
            <div className="flex-1 min-w-0">
              <ProductTitle name={product.name} />
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                   {product.categoryId?.substring(0, 4)} - {product.sku}
                </span>
                <StatusBadge status={product.status!} />
              </div>
            </div>
          </div>
          <ButtonOnlyAction
            data={product}
            handleDelete={handlerDeleteProduct}
            handleEdit={handlerEditProduct}
            handleSee={handlerDetailsProduct}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ProductDetails product={product} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">
              Preço do produto
            </p>
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency(product.price!)}
            </p>
          </div>
        </div>
        <StockInfo product={product} />
      </CardContent>
    </Card>
  );
}
