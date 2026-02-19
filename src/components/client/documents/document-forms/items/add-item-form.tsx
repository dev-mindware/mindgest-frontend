"use client";

import { Plus } from "lucide-react";
import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, InputCurrency, RHFSelect } from "@/components";
import { AsyncCreatableSelectField } from "@/components/common/input-fetch/async-select";
import { useGetTaxes } from "@/hooks/taxes/use-taxes";


export interface ProductOption {
  value: string | number;
  label: string;
  data?: {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
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
  /** IDs of items already added to the invoice — prevents duplicates */
  existingItemIds?: Set<string | number>;
}


export const AddItemForm = React.memo<AddItemFormProps>(
  ({ onAdd, globalDiscount, existingItemIds = new Set() }) => {
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
        // Ensure quantity is at least 1, but capped by stock if product
        if (option.data.type === "PRODUCT") {
          const available = option.data.quantity ?? 0;
          if (available > 0) {
            setValue("quantity", 1);
          } else {
            setValue("quantity", 0);
          }
        }
      }
    }, [setValue]);

    const handleAddClick = useCallback(() => {
      const values = getValues();
      if (!selectedProduct || values.quantity <= 0 || values.price <= 0) {
        return;
      }

      // Final stock check for products
      if (!selectedProduct.__isNew__ && selectedProduct.data?.type === "PRODUCT") {
        const available = selectedProduct.data.quantity ?? 0;
        if (values.quantity > available) {
          return;
        }
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
        apiId: selectedProduct.__isNew__ ? undefined : selectedProduct.value.toString(),
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

    // Stock validation
    const availableStock = !isNewProduct && selectedProduct?.data?.type === "PRODUCT"
      ? (selectedProduct.data.quantity ?? 0)
      : Infinity;

    const isOverStock = watchedType === "PRODUCT" && watchedQuantity > availableStock;
    const isAlreadyAdded = !isNewProduct && selectedProduct
      ? existingItemIds.has(selectedProduct.value)
      : false;
    // Price is locked for catalogue items — edit from the items page if needed
    const isPriceLocked = !isNewProduct && selectedProduct !== null;
    const canAdd = selectedProduct && watchedQuantity > 0 && watchedPrice > 0 && !isOverStock && !isAlreadyAdded;

    // Lock quantity input for services (default is already 1)
    const isService = watchedType === "SERVICE";

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
              <div className="space-y-1">
                <Input
                  {...field}
                  min={1}
                  max={availableStock !== Infinity ? availableStock : undefined}
                  type="quantity"
                  label="Quantidade"
                  disabled={isService}
                  onChange={(e) => {
                    if (isService) return;
                    const val = Number(e.target.value);
                    const cappedVal = watchedType === "PRODUCT" && availableStock !== Infinity
                      ? Math.min(val, availableStock)
                      : val;
                    field.onChange(Math.max(watchedType === "PRODUCT" ? 0 : 1, cappedVal));
                  }}
                  error={isOverStock ? `Máximo: ${availableStock}` : undefined}
                  placeholder="1"
                />
                {!isNewProduct && selectedProduct?.data?.type === "PRODUCT" && (
                  <p className="text-[10px] text-muted-foreground font-medium px-1">
                    Disponível: <span className={availableStock <= 0 ? "text-destructive" : "text-primary"}>{availableStock}</span>
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <InputCurrency
                ref={field.ref}
                label="Preço Unitário"
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                disabled={isPriceLocked}
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
          {isAlreadyAdded && (
            <p className="text-sm text-destructive font-medium">
              Este item já foi adicionado à fatura
            </p>
          )}
          {isOverStock && !isAlreadyAdded && (
            <p className="text-sm text-destructive font-medium">
              Quantidade superior ao stock disponível ({availableStock})
            </p>
          )}
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
