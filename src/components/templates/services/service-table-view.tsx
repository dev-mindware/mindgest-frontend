"use client";
import {
  Icon,
  Button,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TsunamiOnly,
} from "@/components";
import { Product, OrderItem } from "@/types/types";
import { formatPrice } from "@/utils/format-price";
import { useProductActions } from "@/hooks/products";

interface ProductTableProps {
  products: Product[];
  onAddToOrder?: (item: OrderItem) => void;
}

export function ServiceTableView({ products, onAddToOrder }: ProductTableProps) {
  const { handlerDeleteProduct, handlerDetailsProduct, handlerEditProduct } = useProductActions()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Categoria</TableHead>
          <TsunamiOnly>
          <TableHead>Retalho</TableHead>
          <TableHead>Atacado</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          </TsunamiOnly>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.title}</TableCell>
            <TableCell>{product.sku}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TsunamiOnly>
            <TableCell>
              {formatPrice(product.retailPrice.min)} -{" "}
              {formatPrice(product.retailPrice.max)}
            </TableCell>
            <TableCell>
              {formatPrice(product.wholesalePrice.min)} -{" "}
              {formatPrice(product.wholesalePrice.max)}
            </TableCell>
            <TableCell>{product.stock}</TableCell>
            
            <TableCell>
              <Badge
                variant="secondary"
                className={
                  product.isActive
                    ? "text-green-700 bg-green-100 border-green-200"
                    : "text-red-700 bg-red-100 border-red-200"
                }
              >
                {product.isActive ? "Ativo" : "Inactivo"}
              </Badge>
            </TableCell>
            </TsunamiOnly>
            <TableCell>
              <div className="flex gap-1">
                {onAddToOrder && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 hover:bg-primary/10"
                    onClick={() =>
                      onAddToOrder({
                        id: product.id,
                        title: product.title,
                        price: product.retailPrice.min,
                        quantity: 1,
                      })
                    }
                    title="Adicionar ao template"
                  >
                    <Icon name="Plus" className="w-4 h-4 text-primary" />
                  </Button>
                )}
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
                    <DropdownMenuItem
                      onClick={() => handlerDetailsProduct(product)}
                    >
                      Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlerEditProduct(product)}
                    >
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}