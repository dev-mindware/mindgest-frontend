"use client"

import React from 'react';
import { Icon, Button, Badge, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { useModal } from "@/contexts";
import { Product, OrderItem } from '@/types/types';
import { formatPrice } from '@/utils/utils';

interface ProductTableProps {
  products: Product[];
  onAddToOrder?: (item: OrderItem) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onAddToOrder }) => {
  const { openModal } = useModal();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Retalho</TableHead>
          <TableHead>Atacado</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map(product => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.title}</TableCell>
            <TableCell>{product.sku}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{formatPrice(product.retailPrice.min)} - {formatPrice(product.retailPrice.max)}</TableCell>
            <TableCell>{formatPrice(product.wholesalePrice.min)} - {formatPrice(product.wholesalePrice.max)}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              <Badge variant="secondary" className={product.isActive ? "text-green-700 bg-green-100 border-green-200" : "text-red-700 bg-red-100 border-red-200"}>
                {product.isActive ? "Ativo" : "Inactivo"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                {onAddToOrder && (
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-primary/10" onClick={() => onAddToOrder({ id: product.id, title: product.title, price: product.retailPrice.min, quantity: 1 })} title="Adicionar ao template">
                    <Icon name="Plus" className="w-4 h-4 text-primary" />
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="rounded-full shadow-none">
                      <Icon name="Ellipsis" size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => openModal('see')}>Detalhes</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openModal('edit')}>Editar</DropdownMenuItem>
                    <DropdownMenuItem className='text-destructive' onClick={() => openModal('delete')}>Deletar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductTable;