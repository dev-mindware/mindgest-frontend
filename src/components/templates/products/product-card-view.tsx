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
  TsunamiOnly,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components";
import { useProductActions } from "@/hooks";
import { Product } from "@/types/types";
import { formatPrice } from "@/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCardView({ product }: ProductCardProps) {
  const { handlerDeleteProduct, handlerDetailsProduct, handlerEditProduct } =
    useProductActions();

  const truncateTitle = (title: string, maxLength: number = 23) => {
    return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
  };

  return (
    <Card className="relative overflow-hidden transition-shadow duration-200 border border-border bg-card hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10">
              <Icon name="Package" className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="text-sm font-semibold leading-tight truncate cursor-default text-foreground">
                    {truncateTitle(product.name)}
                  </h3>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{product.name}</p>
                </TooltipContent>
              </Tooltip>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  SKU - {product.sku}
                </span>
                <Badge
                  variant="secondary"
                  className={
                    product.status === "Disponível"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : product.status === "Pendente"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }
                >
                  {product.status}
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
                <Icon name="Settings2" size={16} />
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
        <TsunamiOnly>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded-md bg-muted">
              {product.category}
            </span>
            <span className="px-2 py-1 rounded-md bg-muted">
              {product.measurement}
            </span>
            <span className="px-2 py-1 rounded-md bg-muted">
              {product.warranty} dias de garantia
            </span>
          </div>
       </TsunamiOnly>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Preço do produto</p>
            <p className="text-sm font-semibold text-foreground">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
         <TsunamiOnly> 
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {product.stock} no Stock - {product.location}
            </span>
            <span className="text-xs text-muted-foreground">
              Expira em: ({product.expirydate?.toString().slice(0, 10)})
            </span>
          </div>
         </TsunamiOnly>
      </CardContent>
    </Card>
  );
}
