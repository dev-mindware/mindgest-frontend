"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Button,
  EmptyState,
  Input,
  SelectField,
  Separator,
} from "@/components";
import { UseFieldArrayReturn } from "react-hook-form";
import { InvoiceFormData } from "@/schemas";
import { InputFetch } from "@/components/common/input-fetch";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils";

interface InvoiceItemsProps {
  fieldArray: UseFieldArrayReturn<InvoiceFormData, "items">;
  onTotalsChange?: (totals: {
    subtotal: number;
    taxAmount: number;
    retentionAmount: number;
    discountAmount: number;
    total: number;
  }) => void;
  globalTax: number;
  setGlobalTax: (value: number) => void;
  globalRetention: number;
  setGlobalRetention: (value: number) => void;
  globalDiscount: number;
  setGlobalDiscount: (value: number) => void;
}

export function InvoiceItems({
  fieldArray,
  onTotalsChange,
  globalTax,
  setGlobalTax,
  globalRetention,
  setGlobalRetention,
  globalDiscount,
  setGlobalDiscount,
}: InvoiceItemsProps) {
  const { fields, append, remove } = fieldArray;
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [itemDraft, setItemDraft] = useState({
    name: "",
    quantity: 1,
    price: 0,
    type: "PRODUCT" as "PRODUCT" | "SERVICE",
    apiId: undefined as string | undefined,
  });

  const [isItemFromAPI, setIsItemFromAPI] = useState(false);

  const totals = useMemo(() => {
    const subtotal = fields.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );

    const taxAmount = +(subtotal * (globalTax / 100)).toFixed(2);
    const retentionAmount = +(subtotal * (globalRetention / 100)).toFixed(2);
    const discountAmount = +(subtotal * (globalDiscount / 100)).toFixed(2);

    const total = +(
      subtotal +
      taxAmount -
      retentionAmount -
      discountAmount
    ).toFixed(2);

    return {
      subtotal: +subtotal.toFixed(2),
      taxAmount,
      retentionAmount,
      discountAmount,
      total,
    };
  }, [fields, globalTax, globalRetention, globalDiscount]);

  const lastTotalsRef = useRef<string | null>(null);

  useEffect(() => {
    if (!onTotalsChange) return;

    const serialized = JSON.stringify(totals);
    if (serialized !== lastTotalsRef.current) {
      lastTotalsRef.current = serialized;
      onTotalsChange(totals);
    }
  }, [totals, onTotalsChange]);

  const handleAddItem = useCallback(() => {
    const { name, quantity, price, apiId, type } = itemDraft;
    if (!name || quantity <= 0 || price < 0) return;

    append({
      description: name,
      unitPrice: price,
      quantity,
      tax: globalTax,
      /* retention: globalRetention, */
      discount: globalDiscount,
      total: price * quantity,
      type,
      isFromAPI: isItemFromAPI,
      ...(isItemFromAPI && apiId ? { id: apiId } : {}),
    });

    setItemDraft({
      name: "",
      quantity: 1,
      price: 0,
      type: "PRODUCT",
      apiId: undefined,
    });
    setIsItemFromAPI(false);

    // Pequeno timeout para garantir que o estado foi processado antes do foco
    setTimeout(() => {
      firstInputRef.current?.focus();
    }, 0);
  }, [
    append,
    itemDraft,
    globalTax,
    globalRetention,
    globalDiscount,
    isItemFromAPI,
  ]);

  const handleItemFetchChange = useCallback(
    (id: string | number, fullObject: any | null) => {
      if (fullObject?.price) {
        setItemDraft((prev) => ({
          ...prev,
          name: fullObject.name ?? "",
          price: Number(fullObject.price),
          type: fullObject.type ?? "PRODUCT",
          apiId: fullObject.id,
        }));
        setIsItemFromAPI(true);
      } else {
        setItemDraft((prev) => ({
          ...prev,
          name: typeof id === "string" ? id : "",
          price: 0,
          apiId: undefined,
        }));
        setIsItemFromAPI(false);
      }
    },
    []
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Itens da Fatura</h3>
      <Separator />

      <div className="pt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InputFetch
            startIcon="ShoppingBasket"
            label="Nome do Item"
            endpoint="/items"
            displayFields={["name", "description"]}
            onValueChange={handleItemFetchChange}
            ref={firstInputRef}
            value={itemDraft.name}
          />

          <Input
            type="number"
            label="Quantidade"
            min={1}
            value={itemDraft.quantity}
            onChange={(e) =>
              setItemDraft({
                ...itemDraft,
                quantity: Math.max(1, Number(e.target.value)),
              })
            }
          />

          <Input
            type="number"
            label="Preço Unitário"
            min="0"
            step="0.01"
            value={itemDraft.price}
            disabled={isItemFromAPI}
            onChange={(e) =>
              setItemDraft({
                ...itemDraft,
                price: Number(e.target.value),
              })
            }
          />

          {!isItemFromAPI && (
            <SelectField
              label="Tipo"
              value={itemDraft.type}
              onValueChange={(value) =>
                setItemDraft({
                  ...itemDraft,
                  type: value as "PRODUCT" | "SERVICE",
                })
              }
              options={[
                { value: "PRODUCT", label: "Produto" },
                { value: "SERVICE", label: "Serviço" },
              ]}
            />
          )}
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={handleAddItem}>
            Adicionar Item
          </Button>
        </div>
      </div>

      {fields.length === 0 ? (
        <div className="flex justify-center py-12">
          <EmptyState icon="ShoppingBasket" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* TABELA ORIGINAL */}
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">Item</th>
                  <th className="px-4 py-3 text-left text-sm">Tipo</th>
                  <th className="px-4 py-3 text-right text-sm">Qtd</th>
                  <th className="px-4 py-3 text-right text-sm">Preço Unit.</th>
                  <th className="px-4 py-3 text-right text-sm">Subtotal</th>
                  <th className="px-4 py-3 w-[50px]" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {fields.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">{item.description}</td>
                    <td className="px-4 py-3">
                      {item.type === "PRODUCT" ? "Produto" : "Serviço"}
                    </td>
                    <td className="px-4 py-3 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CONTROLOS DE IMPOSTOS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SelectField
              label="Imposto (IVA)"
              value={globalTax}
              onValueChange={(v) => setGlobalTax(Number(v))}
              options={[
                { value: 0, label: "0%" },
                { value: 5, label: "5%" },
                { value: 7, label: "7%" },
                { value: 14, label: "14%" },
                { value: 20, label: "20%" },
              ]}
            />

            <SelectField
              label="Retenção"
              value={globalRetention}
              onValueChange={(v) => setGlobalRetention(Number(v))}
              options={[
                { value: 0, label: "0%" },
                { value: 6.5, label: "6.5%" },
                { value: 10, label: "10%" },
              ]}
            />

            <Input
              type="number"
              label="Desconto (%)"
              min={0}
              max={100}
              step="0.01"
              value={globalDiscount}
              onChange={(e) =>
                setGlobalDiscount(Number(e.target.value))
              }
            />
          </div>

          {/* CARD DE TOTAIS (ORIGINAL) */}
          <div className="flex justify-start">
            <div className="min-w-[280px] space-y-3 border border-dashed rounded-md p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>

              {globalTax > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    IVA ({globalTax}%)
                  </span>
                  <span>+{formatCurrency(totals.taxAmount)}</span>
                </div>
              )}

              {globalRetention > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Retenção ({globalRetention}%)
                  </span>
                  <span className="text-destructive">
                    -{formatCurrency(totals.retentionAmount)}
                  </span>
                </div>
              )}

              {globalDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Desconto ({globalDiscount}%)
                  </span>
                  <span className="text-destructive">
                    -{formatCurrency(totals.discountAmount)}
                  </span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
