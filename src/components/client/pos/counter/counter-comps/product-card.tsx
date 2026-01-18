"use client";

import { useState } from "react";
import { Product } from "@/types";
import {
  Card,
  CardContent,
  Button,
  Icon,
  Popover,
  PopoverContent,
  PopoverAnchor,
  Input,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Badge,
} from "@/components";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format-currency";
import { ErrorMessage } from "@/utils";

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export function ProductCard({
  product,
  quantity,
  onAdd,
  onRemove,
  onUpdateQuantity,
}: ProductCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editQty, setEditQty] = useState("");

  const handleDoubleClick = () => {
    setEditQty(quantity.toString());
    setIsEditing(true);
  };

  if (!product) return null;

  const handleConfirmQty = () => {
    const qty = parseInt(editQty, 10);
    if (!isNaN(qty) && qty > 0) {
      if (qty <= product.reserved) {
        onUpdateQuantity(qty);
        setIsEditing(false);
      } else {
        ErrorMessage(`Apenas ${product.reserved} unidades disponíveis.`);
        setEditQty(product.reserved.toString());
      }
    } else {
      ErrorMessage("Quantidade inválida.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConfirmQty();
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col py-0 relative group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col gap-3">
        {/* Top Content: Image & Title */}
        <div className="flex gap-3 sm:gap-3.5">
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl shrink-0 border border-border/50 shadow-inner">
            <AvatarImage src={product.image} className="object-cover" />
            <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-lg">
              {product.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col justify-between py-0.5 sm:py-1 flex-1 overflow-hidden cursor-help">
                <h3 className="font-bold text-xs sm:text-sm leading-tight line-clamp-2 text-foreground/90 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-[10px] text-muted-foreground leading-tight truncate mt-0.5">
                  {product.description || "Sem descrição"}
                </p>
                <div className="pt-1.5 flex flex-wrap gap-1">
                  {product?.quantity ? (
                    product.quantity > 0 ? (
                      <Badge
                        variant="success"
                        className="text-[9px] px-1.5 py-0 border-none bg-green-500/10 text-green-600"
                      >
                        <div className="w-1 h-1 rounded-full bg-green-500 mr-1" />
                        {product?.quantity} em estoque
                      </Badge>
                    ) : (
                      <Badge
                        variant="destructive"
                        className="text-[9px] px-1.5 py-0 border-none bg-destructive/10 text-destructive"
                      >
                        <div className="w-1 h-1 rounded-full bg-destructive mr-1" />
                        Sem stock
                      </Badge>
                    )
                  ) : (
                    <span className="text-[9px] px-1.5 py-0 border-none bg-destructive/10 text-destructive">
                      Sem quantidade ainda.
                    </span>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              align="start"
              className="max-w-[220px] p-3 flex flex-col gap-1.5 shadow-xl border-border/50 z-[100]"
            >
              <h4 className="font-bold text-sm leading-tight text-white">
                {product.name}
              </h4>
              <p className="text-xs text-white/80 leading-relaxed italic border-t border-white/10 pt-1.5 mt-0.5">
                {product.description ||
                  "Nenhuma descrição disponível para este produto."}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Bottom Content: Price & Actions */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider scale-75 origin-left">
              Preço
            </span>
            <span className="text-sm sm:text-base font-extrabold tabular-nums text-primary -mt-1">
              {formatCurrency(product.price || 0)}
            </span>
          </div>

          <Popover open={isEditing} onOpenChange={setIsEditing}>
            <PopoverAnchor asChild>
              <div className="flex items-center gap-1.5">
                {quantity === 0 ? (
                  <Button
                    size="icon"
                    disabled={product.reserved <= 0}
                    className={cn(
                      "rounded-full h-9 w-9 sm:h-10 sm:w-10 transition-all duration-300 shadow-sm",
                      product.reserved <= 0
                        ? "bg-muted text-muted-foreground cursor-not-allowed border-muted"
                        : "bg-primary text-white hover:bg-primary/90 hover:scale-105 shadow-primary/20",
                    )}
                    onClick={onAdd}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      handleDoubleClick();
                    }}
                  >
                    <Icon name="Plus" className="h-5 w-5" />
                  </Button>
                ) : (
                  <div className="flex items-center gap-1 bg-muted/50 rounded-full p-0.5 sm:p-1 border border-border/60 shadow-sm">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                      onClick={onRemove}
                    >
                      <Icon
                        name="Minus"
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                      />
                    </Button>

                    <span
                      className="text-xs sm:text-sm font-bold min-w-[1.25rem] sm:min-w-[1.5rem] text-center cursor-pointer select-none tabular-nums hover:text-primary transition-colors px-0.5 sm:px-1"
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        handleDoubleClick();
                      }}
                      title="Duplo clique para editar"
                    >
                      {quantity}
                    </span>

                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={product.reserved <= quantity}
                      className={cn(
                        "h-7 w-7 sm:h-8 sm:w-8 rounded-full transition-colors",
                        product.reserved <= quantity
                          ? "text-muted-foreground/30 cursor-not-allowed"
                          : "text-primary hover:bg-primary/10",
                      )}
                      onClick={onAdd}
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        handleDoubleClick();
                      }}
                    >
                      <Icon name="Plus" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </PopoverAnchor>
            <PopoverContent
              className="w-auto p-3 shadow-2xl border-primary/20 backdrop-blur-md z-[110]"
              align="end"
              side="top"
              onInteractOutside={(e) => {
                const target = e.target as HTMLElement;
                if (target?.closest("#virtual-keyboard")) {
                  e.preventDefault();
                }
              }}
            >
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Quantidade
                </span>
                <div className="flex items-center gap-2">
                  <Input
                    value={editQty}
                    onChange={(e) => setEditQty(e.target.value)}
                    className="h-8 w-16 text-center text-sm font-bold focus-visible:ring-primary/30"
                    type="number"
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  <Button
                    size="icon"
                    className="h-8 w-8 shrink-0 bg-primary hover:bg-primary/90"
                    onClick={handleConfirmQty}
                  >
                    <Icon name="Check" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
