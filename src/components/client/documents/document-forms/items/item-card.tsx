"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components";
import { Minus, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { formatCurrency } from "@/utils";

interface ItemCardProps {
  item: any;
  index: number;
  onRemove: (index: number) => void;
  onQuantityChange: (index: number, quantity: number) => void;
  onPriceChange: (index: number, price: number) => void;
}

export const ItemCard = React.memo<ItemCardProps>(
  ({ item, index, onRemove, onQuantityChange, onPriceChange }) => {
    const [isEditingPrice, setIsEditingPrice] = useState(false);
    const [draftPrice, setDraftPrice] = useState<string>("");
    const priceInputRef = useRef<HTMLInputElement>(null);

    const subtotal = item.unitPrice * item.quantity;
    const maximumQuantity = Number(item.availableQuantity);
    const hasMaximumQuantity =
      Number.isFinite(maximumQuantity) && maximumQuantity > 0;
    const canIncrement =
      !hasMaximumQuantity || Number(item.quantity) < maximumQuantity;

    const startEditingPrice = useCallback(() => {
      setDraftPrice(String(item.unitPrice));
      setIsEditingPrice(true);
      setTimeout(() => priceInputRef.current?.select(), 0);
    }, [item.unitPrice]);

    const commitPrice = useCallback(() => {
      const parsed = parseFloat(draftPrice.replace(",", "."));
      if (!isNaN(parsed) && parsed > 0) {
        onPriceChange(index, parsed);
      }
      setIsEditingPrice(false);
    }, [draftPrice, index, onPriceChange]);

    const cancelPrice = useCallback(() => {
      setIsEditingPrice(false);
      setDraftPrice("");
    }, []);

    const handlePriceKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") commitPrice();
        if (e.key === "Escape") cancelPrice();
      },
      [commitPrice, cancelPrice],
    );

    return (
      <div className="rounded-lg border border-border bg-card p-4 shadow-xs space-y-3">
        {/* Cabeçalho do Card: Nome, Tag e Botão Eliminar */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h5 className="font-medium text-foreground text-sm break-words">
              {item.description}
            </h5>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span
                className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full ${
                  item.type === "PRODUCT"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                    : "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                }`}
              >
                {item.type === "PRODUCT" ? "Produto" : "Serviço"}
              </span>
              {item.isFromAPI && (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                  Do catálogo
                </span>
              )}
              <span className="text-[11px] text-muted-foreground font-mono">
                IVA: {item.tax ? `${item.tax}%` : "Isento"}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            aria-label={`Remover item ${item.description}`}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Linha de Controles: Quantidade & Preço Unitário */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Qtd:</span>
            <div className="flex w-[108px] items-center overflow-hidden rounded-md border border-input bg-background">
              <button
                type="button"
                className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => onQuantityChange(index, Number(item.quantity) - 1)}
                disabled={Number(item.quantity) <= 1}
                aria-label={`Diminuir quantidade de ${item.description}`}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <input
                type="number"
                min={1}
                max={hasMaximumQuantity ? maximumQuantity : undefined}
                step={1}
                value={item.quantity}
                onChange={(event) =>
                  onQuantityChange(index, Number(event.target.value) || 1)
                }
                aria-label={`Quantidade de ${item.description}`}
                className="h-8 min-w-0 flex-1 border-x border-input bg-transparent px-1 text-center font-mono text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => onQuantityChange(index, Number(item.quantity) + 1)}
                disabled={!canIncrement}
                aria-label={`Aumentar quantidade de ${item.description}`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-xs text-muted-foreground">Unit:</span>
            {isEditingPrice ? (
              <div className="inline-flex items-center gap-1">
                <input
                  ref={priceInputRef}
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={draftPrice}
                  onChange={(e) => setDraftPrice(e.target.value)}
                  onKeyDown={handlePriceKeyDown}
                  onBlur={commitPrice}
                  className="w-20 rounded border border-primary bg-background px-1.5 py-0.5 text-right font-mono text-xs text-foreground outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  aria-label={`Preço unitário de ${item.description}`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={commitPrice}
                  className="flex h-6 w-6 items-center justify-center rounded text-green-600 hover:bg-green-50"
                  aria-label="Confirmar preço"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={cancelPrice}
                  className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted"
                  aria-label="Cancelar edição"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={startEditingPrice}
                title="Clique para editar o preço"
                className="group/price inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-xs text-foreground transition-colors hover:bg-muted hover:text-primary"
                aria-label={`Editar preço unitário de ${item.description}`}
              >
                <span>{formatCurrency(item.unitPrice)}</span>
                <Pencil className="h-3 w-3 opacity-60 group-hover/price:opacity-100" />
              </button>
            )}
          </div>
        </div>

        {/* Rodapé do Card: Subtotal destacado */}
        <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs">
          <span className="text-muted-foreground font-medium">Subtotal:</span>
          <span className="font-mono font-semibold text-foreground text-sm">
            {formatCurrency(subtotal)}
          </span>
        </div>
      </div>
    );
  },
);

ItemCard.displayName = "ItemCard";
