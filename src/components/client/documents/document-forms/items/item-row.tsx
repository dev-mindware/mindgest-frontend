"use client";

import React from "react";
import { Button } from "@/components";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils";

interface ItemRowProps {
  item: any;
  index: number;
  onRemove: (index: number) => void;
  onQuantityChange: (index: number, quantity: number) => void;
}

export const ItemRow = React.memo<ItemRowProps>(({ item, index, onRemove, onQuantityChange }) => {
  const subtotal = item.unitPrice * item.quantity;
  const isService = item.type === "SERVICE";
  const maximumQuantity = Number(item.availableQuantity);
  const hasMaximumQuantity =
    Number.isFinite(maximumQuantity) && maximumQuantity > 0;
  const canIncrement =
    !isService &&
    (!hasMaximumQuantity || Number(item.quantity) < maximumQuantity);

  return (
    <tr>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-foreground">
            {item.description}
          </span>
          {item.isFromAPI && (
            <span className="inline-flex items-center gap-1 text-xs text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              Do catálogo
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex px-2 py-1 text-xs rounded-full ${item.type === "PRODUCT"
              ? "bg-blue-100 text-blue-800"
              : "bg-purple-100 text-purple-800"
            }`}
        >
          {item.type === "PRODUCT" ? "Produto" : "Serviço"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="ml-auto flex w-[116px] items-center overflow-hidden rounded-md border border-input bg-background">
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => onQuantityChange(index, Number(item.quantity) - 1)}
            disabled={isService || Number(item.quantity) <= 1}
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
            disabled={isService}
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
      </td>
      <td className="px-4 py-3 text-right font-mono text-foreground">
        {formatCurrency(item.unitPrice)}
      </td>
      <td className="px-4 py-3 text-right font-mono font-medium text-f">
        {formatCurrency(subtotal)}
      </td>
      <td className="px-4 py-3 text-right font-mono text-foreground">
        {item.tax ? `${item.tax}%` : "Isento"}
      </td>
      <td className="px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
});

ItemRow.displayName = "ItemRow";
