"use client"
import { useState } from 'react';
import { Button, Badge, Card, CardContent, CardHeader, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input } from '@/components/ui';
import { Icon, DeleteProduct, SeeProduct, EditProduct } from '@/components';
import { useModal } from "@/stores/use-modal-store";

export interface ProductCard {
  id: string;
  title: string;
  sku: string;
  category: string;
  subcategory: string;
  retailPrice: {
    min: number;
    max: number;
  };
  wholesalePrice: {
    min: number;
    max: number;
  };
  stock: number;
  location: string;
  variants: number;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface ProductCardsProps {
  onAddToOrder?: (item: OrderItem) => void;
  className?: string;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const ProductCards: React.FC<ProductCardsProps> = ({ onAddToOrder, className }) => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductCard | null>(null);
  const { openModal } = useModal();

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (product: ProductCard) => {
    setSelectedProduct(product);
    openModal('delete');
  };

  const handleEdit = (product: ProductCard) => {
    setSelectedProduct(product);
    openModal('edit-product');
  };

  const handleSee = (product: ProductCard) => {
    setSelectedProduct(product);
    openModal('see');
  };

  return (
    <div className="justify-start mt-10 bg-background">
      <div className="mx-auto space-y-4 max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <Input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar produtos..."
            className="w-full h-10 text-sm border rounded-md ps-10 pe-10 border-input bg-background"
          />
        </div>

        <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${className ?? ''}`}>
          {filteredProducts.map(product => (
            <Card key={product.id} className="relative overflow-hidden transition-shadow duration-200 border border-border bg-card hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10">
                      <Icon name='Package' className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold leading-tight truncate text-foreground">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          SKU - {product.sku}
                        </span>
                        <Badge variant="secondary" className={`text-xs ${product.isActive ? "text-green-700 bg-green-100 border-green-200" : "text-red-700 bg-red-100 border-red-200"}`}>
                          {product.isActive ? "Ativo" : "Inativo"}
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
                        aria-label="Open edit menu"
                      >
                        <Icon name="Ellipsis" size={16} aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleSee(product)}>Detalhes</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(product)}>Editar</DropdownMenuItem>
                      <DropdownMenuItem className='text-destructive' onClick={() => handleDelete(product)}>Deletar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-1 rounded-md bg-muted">{product.category}</span>
                  <span className="px-2 py-1 rounded-md bg-muted">{product.subcategory}</span>
                  <span className="px-2 py-1 rounded-md bg-muted">+{product.variants}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Retalho</p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatPrice(product.retailPrice.min)} - {formatPrice(product.retailPrice.max)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Atacado</p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatPrice(product.wholesalePrice.min)} - {formatPrice(product.wholesalePrice.max)}
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
          ))}
        </div>
      </div>
      <DeleteProduct />
      <SeeProduct />
      <EditProduct />
    </div>
  );
};

export default ProductCards;
