"use client";

import { Plus } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, InputCurrency, RHFSelect } from "@/components";
import { AsyncCreatableSelectField } from "@/components/common/input-fetch/async-select";
import { formatCurrency, parseCurrency } from "@/utils";
import { useGetTaxes } from "@/hooks/taxes/use-taxes";


export interface ProductOption {
  value: string | number;
  label: string;
  data?: {
    id: string | number;
    name: string;
    price: number;
    type: "PRODUCT" | "SERVICE";
    description?: string;
    tax?: {
      rate: number;
    };
  };
  __isNew__?: boolean;
}

interface AddItemFormProps {
  onAdd: (item: any) => void;
  globalDiscount: number;
}


export const AddItemForm = React.memo<AddItemFormProps>(
  ({ onAdd, globalDiscount }) => {
    const { taxOptions } = useGetTaxes();
    const [selectedProduct, setSelectedProduct] =
      useState<ProductOption | null>(null);

    const { control, handleSubmit, setValue, getValues, resetField, watch, reset } = useForm({
      defaultValues: {
        quantity: 1,
        price: 0,
        type: "PRODUCT" as "PRODUCT" | "SERVICE",
        taxId: "",
      }
    });

    const watchedPrice = watch("price");
    const watchedQuantity = watch("quantity");
    const watchedType = watch("type");
    const watchedTaxId = watch("taxId");


    const handleProductChange = useCallback((option: ProductOption | null) => {
      setSelectedProduct(option);

      if (!option) {
        setValue("price", 0);
        setValue("type", "PRODUCT");
        setValue("taxId", "");
        return;
      }

      if (option.__isNew__) {
        setValue("price", 0);
        setValue("type", "PRODUCT");
        setValue("taxId", "");
      } else if (option.data) {
        setValue("price", Number(option.data.price));
        setValue("type", option.data.type);
      }
    }, [setValue]);

    const handleAddClick = useCallback(() => {
      const values = getValues();
      if (!selectedProduct || values.quantity <= 0 || values.price <= 0) {
        return;
      }

      const selectedTax = taxOptions.find((t) => t.value === values.taxId);
      const taxRate = selectedTax
        ? Number(selectedTax.label.match(/\((\d+)%\)/)?.[1] || 0)
        : 0;

      const newItem = {
        description: selectedProduct.label,
        unitPrice: values.price,
        quantity: values.quantity,
        tax: selectedProduct.data?.tax?.rate || taxRate,
        taxId: values.taxId || undefined,
        discount: globalDiscount,
        total: values.price * values.quantity,
        type: values.type,
        isFromAPI: !selectedProduct.__isNew__,
        ...(selectedProduct.__isNew__ ? {} : { id: selectedProduct.value }),
      };

      onAdd(newItem);

      setSelectedProduct(null);
      reset({
        quantity: 1,
        price: 0,
        type: "PRODUCT",
        taxId: "",
      });
    }, [
      selectedProduct,
      getValues,
      taxOptions,
      globalDiscount,
      onAdd,
      reset,
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
    const canAdd = selectedProduct && watchedQuantity > 0 && watchedPrice > 0;

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
              minChars={3}
              formatCreateLabel={(input: string) => `➕ Adicionar "${input}"`}
            />
          </div>

          <Controller
            control={control}
            name="quantity"
            render={({ field }) => (
              <Input
                {...field}
                min={1}
                type="quantity"
                label="Quantidade"
                onChange={(e) => field.onChange(Math.max(1, Number(e.target.value)))}
                placeholder="1"
              />
            )}
          />

          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <InputCurrency
                ref={field.ref}
                label="Preço Unitário"
                placeholder="0,00"
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
              />
            )}
          />

        </div>

        {isNewProduct && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RHFSelect
              name="type"
              label="Tipo de Item"
              control={control}
              options={[
                { value: "PRODUCT", label: "Produto" },
                { value: "SERVICE", label: "Serviço" },
              ]}
            />
            <RHFSelect
              name="taxId"
              label="Imposto"
              control={control}
              options={taxOptions}
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
