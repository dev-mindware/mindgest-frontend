"use client";

import { useState } from "react";
import { ProductMock } from "./data";
import { Card, CardContent, Button, Icon, Popover, PopoverContent, PopoverTrigger, Input, Avatar, AvatarFallback, AvatarImage, Tooltip, TooltipContent, TooltipTrigger, Badge } from "@/components";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format-currency";

interface ProductSectionProps {
    products: ProductMock[];
    cartItems: Record<string, number>;
    onAddToCart: (product: ProductMock) => void;
    onRemoveFromCart: (productId: string) => void;
    onUpdateQuantity: (productId: string, quantity: number) => void;
}

export function ProductSection({
    products,
    cartItems,
    onAddToCart,
    onRemoveFromCart,
    onUpdateQuantity,
}: ProductSectionProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    quantity={cartItems[product.id] || 0}
                    onAdd={() => onAddToCart(product)}
                    onRemove={() => onRemoveFromCart(product.id)}
                    onUpdateQuantity={(qty) => onUpdateQuantity(product.id, qty)}
                />
            ))}
        </div>
    );
}

interface ProductCardProps {
    product: ProductMock;
    quantity: number;
    onAdd: () => void;
    onRemove: () => void;
    onUpdateQuantity: (quantity: number) => void;
}

function ProductCard({ product, quantity, onAdd, onRemove, onUpdateQuantity }: ProductCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editQty, setEditQty] = useState("");

    const handleDoubleClick = () => {
        setEditQty(quantity.toString());
        setIsEditing(true);
    };

    const handleConfirmQty = () => {
        const qty = parseInt(editQty, 10);
        if (!isNaN(qty)) {
            onUpdateQuantity(qty);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleConfirmQty();
        }
    };

    return (
        <Card className="overflow-hidden flex flex-col py-0 relative group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4 flex-1 flex flex-col gap-3">
                {/* Top Content: Image & Title */}
                <div className="flex gap-3.5">
                    <Avatar className="h-16 w-16 rounded-xl shrink-0 border border-border/50">
                        <AvatarImage src={product.image} className="object-cover" />
                        <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-lg">{product.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex flex-col justify-between py-1 flex-1 overflow-hidden cursor-help">
                                <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-foreground/90 group-hover:text-primary transition-colors">
                                    {product.name.length > 11 ? `${product.name.slice(0, 11)}...` : product.name}
                                </h3>
                                <p className="text-[10px] text-muted-foreground leading-tight truncate">
                                    {product.description || "Sem descrição"}
                                </p>
                                <div className="pt-1">
                                    {product.stock > 0 ? (
                                        <Badge variant="success" className="text-[10px] sm:text-[9px] px-2 sm:px-1.5 py-0.5 sm:py-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            {product.stock} em estoque
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive" className="text-[10px] sm:text-[9px] px-2 sm:px-1.5 py-0.5 sm:py-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                                            Sem stock
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" align="start" className="max-w-[220px] p-3 flex flex-col gap-1.5 shadow-xl border-border/50">
                            <h4 className="font-bold text-sm leading-tight text-primary-foreground">{product.name}</h4>
                            <p className="text-xs text-primary-foreground/80 leading-relaxed italic border-t border-primary-foreground/10 pt-1.5 mt-0.5">
                                {product.description || "Nenhuma descrição disponível para este produto."}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* Bottom Content: Price & Actions */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
                    <span className="text-base font-extrabold tabular-nums text-primary">
                        {formatCurrency(product.price || 0)}
                    </span>

                    {quantity === 0 ? (
                        <Button
                            size="icon"
                            disabled={product.stock <= 0}
                            className={cn(
                                "rounded-full h-10 w-10 transition-all duration-300 shadow-sm",
                                product.stock <= 0
                                    ? "bg-muted text-muted-foreground cursor-not-allowed border-muted"
                                    : "bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 hover:shadow-primary/20"
                            )}
                            onClick={onAdd}
                        >
                            <Icon name="Plus" className="h-5 w-5" />
                        </Button>
                    ) : (
                        <div className="flex items-center gap-1.5 bg-muted/40 rounded-full p-1 border border-border/60">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                                onClick={onRemove}
                            >
                                <Icon name="Minus" className="h-4 w-4" />
                            </Button>

                            <Popover open={isEditing} onOpenChange={setIsEditing}>
                                <PopoverTrigger asChild>
                                    <span
                                        className="text-sm font-bold min-w-[1.5rem] text-center cursor-pointer select-none tabular-nums hover:text-primary transition-colors px-1"
                                        onDoubleClick={(e) => {
                                            e.preventDefault();
                                            handleDoubleClick();
                                        }}
                                        title="Duplo clique para editar"
                                    >
                                        {quantity}
                                    </span>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-3 shadow-2xl border-primary/20 backdrop-blur-md"
                                    align="center"
                                    side="top"
                                    onInteractOutside={(e) => {
                                        const target = e.target as HTMLElement;
                                        if (target?.closest("#virtual-keyboard")) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quantidade</span>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                value={editQty}
                                                onChange={(e) => setEditQty(e.target.value)}
                                                className="h-8 w-16 text-center text-sm font-bold focus-visible:ring-primary/30"
                                                type="number"
                                                onKeyDown={handleKeyDown}
                                                autoFocus
                                            />
                                            <Button size="icon" className="h-8 w-8 shrink-0 bg-primary hover:bg-primary/90" onClick={handleConfirmQty}>
                                                <Icon name="Check" className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <Button
                                size="icon"
                                variant="ghost"
                                disabled={product.stock <= quantity}
                                className={cn(
                                    "h-8 w-8 rounded-full transition-colors",
                                    product.stock <= quantity
                                        ? "text-muted-foreground/30 cursor-not-allowed"
                                        : "text-primary hover:bg-primary/10"
                                )}
                                onClick={onAdd}
                            >
                                <Icon name="Plus" className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
