"use client";
import React, { useState, useMemo, useCallback } from "react";
import {
  Button,
  EmptyState,
  Input,
  SelectField,
  Separator,
} from "@/components";
import { UseFieldArrayReturn } from "react-hook-form";
import { InvoiceFormData } from "@/schemas";
import { AsyncCreatableSelectField } from "@/components/common/input-fetch/async-select";
import { Trash2, Plus, Package } from "lucide-react";
import { formatCurrency, parseCurrency } from "@/utils";

/**
 * Props do componente principal
 * Removemos onTotalsChange pois agora os totais são calculados no componente pai
 */
interface InvoiceItemsProps {
  fieldArray: UseFieldArrayReturn<InvoiceFormData, "items">;
  globalTax: number;
  setGlobalTax: (value: number) => void;
  globalRetention: number;
  setGlobalRetention: (value: number) => void;
  globalDiscount: number;
  setGlobalDiscount: (value: number) => void;
}

/**
 * Interface para as opções do select de produtos
 */
interface ProductOption {
  value: string | number;
  label: string;
  data?: {
    id: string | number;
    name: string;
    price: number;
    type: "PRODUCT" | "SERVICE";
    description?: string;
  };
  __isNew__?: boolean;
}

/**
 * Componente separado para o formulário de adicionar item
 * Isso evita que mudanças no formulário causem re-render da lista inteira
 */

const AddItemForm = React.memo<{
  onAdd: (item: any) => void;
  globalTax: number;
  globalDiscount: number;
}>(({ onAdd, globalTax, globalDiscount }) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [type, setType] = useState<"PRODUCT" | "SERVICE">("PRODUCT");

  const handleProductChange = useCallback((option: ProductOption | null) => {
    setSelectedProduct(option);

    if (!option) {
      // Limpa tudo quando não há seleção
      setPrice(0);
      setType("PRODUCT");
      return;
    }

    if (option.__isNew__) {
      // Novo produto - usuário precisa preencher manualmente
      setPrice(0);
      setType("PRODUCT");
    } else if (option.data) {
      // Produto da API - preenche automaticamente
      setPrice(Number(option.data.price));
      setType(option.data.type);
    }
  }, []);

  const handleAddClick = useCallback(() => {
    // Validação básica
    if (!selectedProduct || quantity <= 0 || price < 0) {
      return;
    }

    // Constrói o objeto do item
    const newItem = {
      description: selectedProduct.label,
      unitPrice: price,
      quantity,
      tax: globalTax,
      discount: globalDiscount,
      total: price * quantity,
      type,
      isFromAPI: !selectedProduct.__isNew__,
      // Só inclui o ID se for da API
      ...(selectedProduct.__isNew__ ? {} : { id: selectedProduct.value }),
    };

    onAdd(newItem);

    setSelectedProduct(null);
    setQuantity(1);
    setPrice(0);
    setType("PRODUCT");
  }, [
    selectedProduct,
    quantity,
    price,
    type,
    globalTax,
    globalDiscount,
    onAdd,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleAddClick();
      }
    },
    [handleAddClick]
  );

  const isNewProduct = selectedProduct?.__isNew__ ?? false;
  const canAdd = selectedProduct && quantity > 0 && price >= 0;
  const itemTotal = price * quantity;

  return (
    <div className="space-y-4" onKeyDown={handleKeyDown}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <AsyncCreatableSelectField
            endpoint="/items"
            label="Produto/Serviço"
            placeholder="Digite o nome do item..."
            value={selectedProduct}
            onChange={handleProductChange}
            displayFields={["name", "description"]}
            minChars={2}
            formatCreateLabel={(input: string) => `➕ Adicionar "${input}"`}
          />
        </div>

        <Input
          type="number"
          label="Quantidade"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          placeholder="1"
        />

        <Input
          label="Preço Unitário (Kz)"
          value={formatCurrency(price)}
          onChange={(e) => setPrice(parseCurrency(e.target.value))}
          disabled={!isNewProduct}
          placeholder="0.00"
        />
      </div>

      {isNewProduct && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Tipo de Item"
            value={type}
            onValueChange={(value) => setType(value as "PRODUCT" | "SERVICE")}
            options={[
              { value: "PRODUCT", label: "Produto" },
              { value: "SERVICE", label: "Serviço" },
            ]}
          />
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          onClick={handleAddClick}
          disabled={!canAdd}
          className="ml-auto flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar à Fatura
        </Button>
      </div>
    </div>
  );
});

AddItemForm.displayName = "AddItemForm";

const ItemRow = React.memo<{
  item: any;
  index: number;
  onRemove: (index: number) => void;
}>(({ item, index, onRemove }) => {
  const subtotal = item.unitPrice * item.quantity;

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
          className={`inline-flex px-2 py-1 text-xs rounded-full ${
            item.type === "PRODUCT"
              ? "bg-blue-100 text-blue-800"
              : "bg-purple-100 text-purple-800"
          }`}
        >
          {item.type === "PRODUCT" ? "Produto" : "Serviço"}
        </span>
      </td>
      <td className="px-4 py-3 text-right font-mono text-foreground">
        {item.quantity}
      </td>
      <td className="px-4 py-3 text-right font-mono text-foreground">
        {formatCurrency(item.unitPrice)}
      </td>
      <td className="px-4 py-3 text-right font-mono font-medium text-f">
        {formatCurrency(subtotal)}
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

export function InvoiceItems({
  fieldArray,
  globalTax,
  setGlobalTax,
  globalRetention,
  setGlobalRetention,
  globalDiscount,
  setGlobalDiscount,
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

  const totals = useMemo(() => {
    const subtotal = fields.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );

    const taxAmount = subtotal * (globalTax / 100);
    const retentionAmount = subtotal * (globalRetention / 100);
    const discountAmount = subtotal * (globalDiscount / 100);
    const total = subtotal + taxAmount - retentionAmount - discountAmount;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      retentionAmount: Number(retentionAmount.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  }, [fields, globalTax, globalRetention, globalDiscount]);

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
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
            <table className="w-full">
              <thead className="bg-card border-border">
                <tr className="text-foreground">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                    Qtd.
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                    Preço Unit.
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th className="px-4 py-3 w-[60px]" aria-label="Ações" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-c">
                {fields.map((item, index) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    index={index}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectField
              label="Imposto (IVA)"
              value={globalTax}
              onValueChange={(v) => setGlobalTax(Number(v))}
              options={[
                { value: 0, label: "Isento (0%)" },
                { value: 5, label: "5%" },
                { value: 7, label: "7%" },
                { value: 14, label: "14%" },
                { value: 20, label: "20%" },
              ]}
            />

            <SelectField
              label="Retenção na Fonte"
              value={globalRetention}
              onValueChange={(v) => setGlobalRetention(Number(v))}
              options={[
                { value: 0, label: "Sem retenção (0%)" },
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
              onChange={(e) => setGlobalDiscount(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-">
            <div className="w-full sm:w-96 space-y-3 border border-dashed rounded-lg p-6 bg-card">
              <div className="flex justify-between items-center text-gray-600">
                <span className="text-sm">Subtotal</span>
                <span className="font-mono text-base">
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>

              {globalTax > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span className="text-sm">IVA ({globalTax}%)</span>
                  <span className="font-mono text-base">
                    +{formatCurrency(totals.taxAmount)}
                  </span>
                </div>
              )}

              {globalRetention > 0 && (
                <div className="flex justify-between items-center text-red-600">
                  <span className="text-sm">Retenção ({globalRetention}%)</span>
                  <span className="font-mono text-base">
                    -{formatCurrency(totals.retentionAmount)}
                  </span>
                </div>
              )}

              {globalDiscount > 0 && (
                <div className="flex justify-between items-center text-red-600">
                  <span className="text-sm">Desconto ({globalDiscount}%)</span>
                  <span className="font-mono text-base">
                    -{formatCurrency(totals.discountAmount)}
                  </span>
                </div>
              )}

              <Separator className="my-3" />

              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-foreground">Total a Pagar</span>
                <span className="font-mono text-primary">
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
