"use client";

import { useState } from "react";
import { Product } from "@/types";
import { Icon, ScrollArea } from "@/components";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MobileMenuViewProps {
  products: Product[];
  categories: any[];
  onAddToCart: (product: Product) => void;
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  isLoading?: boolean;
  onViewOrder?: () => void;
  cartItems?: any[];
}

export function MobileMenuView({
  products,
  categories,
  onAddToCart,
  activeCategory,
  onCategoryChange,
  isLoading,
  onViewOrder,
  cartItems
}: MobileMenuViewProps) {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background pb-16">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
               <Icon name="Store" size={18} className="text-primary" />
            </div>
            <h1 className="text-lg font-bold">Facturação</h1>
          </div>
          <button 
            onClick={onViewOrder}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center relative"
          >
            <Icon name="ShoppingBag" size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Pesquisar menu..." 
            className="pl-10 h-11 bg-muted/50 border-none rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Categories */}
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-colors h-11",
                  activeCategory === cat.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card border border-border text-foreground"
                )}
              >
                {/* Simplified icon logic for example */}
                <Icon name={cat.name.includes("Bebida") ? "Coffee" : "Pizza"} size={16} />
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </ScrollArea>

        <h2 className="text-lg font-bold mt-2">Menu</h2>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="grid grid-cols-2 gap-4 pb-6">
          {filteredProducts.map((product) => {
            const cartItem = cartItems?.find(item => item.id === product.id);
            const isInCart = !!cartItem;

            return (
              <div 
                key={product.id} 
                className={cn(
                  "bg-card rounded-2xl border overflow-hidden active:scale-95 transition-all relative",
                  isInCart ? "border-primary border-2 shadow-md shadow-primary/10" : "border-border"
                )}
                onClick={() => onAddToCart(product)}
              >
                <div className="relative aspect-square bg-muted">
                  {product.image ? (
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border-b">
                      <Icon name="Package" size={32} className="text-muted-foreground" />
                    </div>
                  )}

                  {/* Quantity Badge */}
                  {isInCart && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-background animate-in zoom-in duration-200 z-10">
                      {cartItem.qty}
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="text-sm font-bold line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">{formatCurrency(product.price || 0)}</span>
                    <span className="text-[10px] text-muted-foreground truncate ml-1">
                      {product.quantity > 0 ? `Stock: ${product.quantity}` : "Esgotado"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
