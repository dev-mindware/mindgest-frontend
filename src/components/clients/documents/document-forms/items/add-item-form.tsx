"use client";

import { Plus } from "lucide-react";
import React, { useState, useCallback } from "react";
import { Button, Input, SelectField } from "@/components";
import { AsyncCreatableSelectField } from "@/components/common/input-fetch/async-select";
import { formatCurrency, parseCurrency } from "@/utils";

export interface ProductOption {
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

interface AddItemFormProps {
  onAdd: (item: any) => void;
  globalTax: number;
  globalDiscount: number;
}

export const AddItemForm = React.memo<AddItemFormProps>(
  ({ onAdd, globalTax, globalDiscount }) => {
    const [selectedProduct, setSelectedProduct] =
      useState<ProductOption | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [type, setType] = useState<"PRODUCT" | "SERVICE">("PRODUCT");

    const handleProductChange = useCallback((option: ProductOption | null) => {
      setSelectedProduct(option);

      if (!option) {
        setPrice(0);
        setType("PRODUCT");
        return;
      }

      if (option.__isNew__) {
        setPrice(0);
        setType("PRODUCT");
      } else if (option.data) {
        setPrice(Number(option.data.price));
        setType(option.data.type);
      }
    }, []);

    const handleAddClick = useCallback(() => {
      if (!selectedProduct || quantity <= 0 || price <= 0) {
        return;
      }

      const newItem = {
        description: selectedProduct.label,
        unitPrice: price,
        quantity,
        tax: globalTax,
        discount: globalDiscount,
        total: price * quantity,
        type,
        isFromAPI: !selectedProduct.__isNew__,
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
    const canAdd = selectedProduct && quantity > 0 && price > 0;

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
  }
);

AddItemForm.displayName = "AddItemForm";
