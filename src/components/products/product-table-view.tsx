"use client";
import {
  Icon,
  Button,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ButtonOnlyAction,
} from "@/components";
import { Product, OrderItem } from "@/types";
import { formatPrice } from "@/utils/format-price";
import { useProductActions } from "@/hooks/products";

interface ProductTableProps {
  products: Product[];
  onAddToOrder?: (item: OrderItem) => void;
}

export function ProductTableView({
  products,
  onAddToOrder,
}: ProductTableProps) {
  const { handlerDeleteProduct, handlerDetailsProduct, handlerEditProduct } =
    useProductActions();

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{formatPrice(product.price!)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    product.status === "Disponível"
                      ? "text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : product.status === "Pendente"
                      ? "text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }
                >
                  {product.status}
                </Badge>
              </TableCell>
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
                          title: product.name,
                          price: product.price!,
                          quantity: 1,
                        })
                      }
                      title="Adicionar ao template"
                    >
                      <Icon name="Plus" className="w-4 h-4 text-primary" />
                    </Button>
                  )}
                  <ButtonOnlyAction
                    data={product}
                    handleDelete={handlerDeleteProduct}
                    handleEdit={handlerEditProduct}
                    handleSee={handlerDetailsProduct}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
