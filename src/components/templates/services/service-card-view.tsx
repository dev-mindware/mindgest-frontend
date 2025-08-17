"use client";
import {
  Card,
  Icon,
  Button,
  Badge,
  CardContent,
  DropdownMenu,
  CardHeader,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components";
import { useProductActions } from "@/hooks";
import { Product } from "@/types/types";
import { formatPrice } from "@/utils";

interface ProductCardProps {
  product: Product;
}

export function ServiceCardView({ product }: ProductCardProps) {
  const { handlerDeleteProduct, handlerDetailsProduct, handlerEditProduct } =
    useProductActions();

  return (
    <Card className="relative overflow-hidden transition-shadow duration-200 border border-border bg-card hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10">
              <Icon name="Package" className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold leading-tight truncate text-foreground">
                {product.title} 
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  SKU - {product.sku}
                </span>
                <Badge
                  variant="secondary"
                  className={
                    product.isActive
                      ? "text-xs text-green-700 bg-green-100 border-green-200"
                      : "text-xs text-red-700 bg-red-100 border-red-200"
                  }
                >
                  {product.isActive ? "Ativo" : "Inactivo"}
                </Badge>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full shadow-none"
              >
                <Icon name="Ellipsis" size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handlerDetailsProduct(product)}>
                Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlerEditProduct(product)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handlerDeleteProduct(product)}
              >
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded-md bg-muted">
            {product.category}
          </span>
          <span className="px-2 py-1 rounded-md bg-muted">
            {product.subcategory}
          </span>
          <span className="px-2 py-1 rounded-md bg-muted">
            +{product.variants}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Retalho</p>
            <p className="text-sm font-semibold text-foreground">
              {formatPrice(product.retailPrice.min)} -{" "}
              {formatPrice(product.retailPrice.max)}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Atacado</p>
            <p className="text-sm font-semibold text-foreground">
              {formatPrice(product.wholesalePrice.min)} -{" "}
              {formatPrice(product.wholesalePrice.max)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {product.stock} no Stock - {product.location}
          </span>
          <span className="text-xs text-muted-foreground">
            Variantes ({product.variants})
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
