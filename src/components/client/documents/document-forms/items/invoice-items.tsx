"use client";
import { useCallback } from "react";
import { Separator } from "@/components";
import { UseFieldArrayReturn } from "react-hook-form";
import { ProformaFormData } from "@/schemas";
import { Package } from "lucide-react";
import { AddItemForm } from "./add-item-form";
import { ItemList } from "./item-list";
import { InvoiceSummary } from "./invoice-summary";

interface InvoiceItemsProps {
  fieldArray: UseFieldArrayReturn<ProformaFormData, "items">;
  globalTax: number;
  setGlobalTax: (value: number) => void;
  globalRetention: number;
  setGlobalRetention: (value: number) => void;
  globalDiscount: number;
  setGlobalDiscount: (value: number) => void;
  totals: {
    subtotal: number;
    taxAmount: number;
    retentionAmount: number;
    discountAmount: number;
    total: number;
  };
}

export function InvoiceItems({
  fieldArray,
  globalTax,
  setGlobalTax,
  globalRetention,
  setGlobalRetention,
  globalDiscount,
  setGlobalDiscount,
  totals,
}: InvoiceItemsProps) {
  const { fields, append, remove } = fieldArray;

  const handleAddItem = useCallback(
    (item: any) => {
      append(item);
    },
    [append]
  );

  const handleRemoveItem = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Itens da Fatura
        </h3>
        {fields.length > 0 && (
          <span className="text-sm text-foreground bg-card px-3 py-1 rounded-full">
            {fields.length} {fields.length === 1 ? "item" : "itens"}
          </span>
        )}
      </div>

      <Separator />

      <AddItemForm
        onAdd={handleAddItem}
        globalTax={globalTax}
        globalDiscount={globalDiscount}
      />

      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 bg-card rounded-lg border-2 border-dashed">
          <Package className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-sm font-medium text-foreground mb-1">
            Nenhum item adicionado
          </p>
          <p className="text-xs text-foreground">
            Use o formulário acima para adicionar itens à fatura
          </p>
        </div>
      ) : (
        <>
          <ItemList items={fields} onRemove={handleRemoveItem} />
          <InvoiceSummary
            totals={totals}
            globalTax={globalTax}
            setGlobalTax={setGlobalTax}
            globalRetention={globalRetention}
            setGlobalRetention={setGlobalRetention}
            globalDiscount={globalDiscount}
            setGlobalDiscount={setGlobalDiscount}
          />
        </>
      )}
    </div>
  );
}
