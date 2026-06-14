"use client";

import { useMemo, useState } from "react";
import {
  Controller,
  useWatch,
  type Control,
  type UseFieldArrayAppend,
  type UseFormRegister,
} from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { CreditNoteFormData } from "@/schemas";
import { Button, Input, InputCurrency, Separator } from "@/components";
import { AsyncCreatableSelectField } from "@/components/common/input-fetch/async-select";
import { formatCurrency } from "@/utils";

type ItemOption = {
  value: string | number;
  label: string;
  data?: {
    id: string;
    name: string;
    price: number;
    type: "PRODUCT" | "SERVICE";
  };
  __isNew__?: boolean;
};

interface ItemsSummarySectionProps {
  control: Control<CreditNoteFormData>;
  register: UseFormRegister<CreditNoteFormData>;
  errors: any;
  fields: any[];
  append: UseFieldArrayAppend<CreditNoteFormData, "invoiceBody.items">;
  remove: (index: number) => void;
}

export function ItemsSummarySection({
  control,
  register,
  errors,
  fields,
  append,
  remove,
}: ItemsSummarySectionProps) {
  const [selectedItem, setSelectedItem] = useState<ItemOption | null>(null);
  const watchedItems = useWatch({ control, name: "invoiceBody.items" });
  const creditNoteSubtotal = useWatch({ control, name: "creditNote.subtotal" });
  const creditNoteTaxAmount = useWatch({ control, name: "creditNote.taxAmount" });
  const creditNoteTotal = useWatch({ control, name: "creditNote.total" });
  const invoiceBodySubtotal = useWatch({ control, name: "invoiceBody.subtotal" });
  const invoiceBodyTotal = useWatch({ control, name: "invoiceBody.total" });

  const existingIds = useMemo(
    () => new Set((watchedItems || []).map((item) => String(item.id))),
    [watchedItems],
  );
  const selectedAlreadyExists = selectedItem
    ? existingIds.has(String(selectedItem.value))
    : false;
  const canAdd = Boolean(
    selectedItem?.data &&
      Number(selectedItem.data.price) > 0 &&
      !selectedItem.__isNew__ &&
      !selectedAlreadyExists,
  );

  const handleAddItem = () => {
    if (!selectedItem?.data || !canAdd) return;

    append({
      id: String(selectedItem.data.id || selectedItem.value),
      name: selectedItem.data.name || selectedItem.label,
      quantity: 1,
      price: Number(selectedItem.data.price || 0),
      type: selectedItem.data.type,
    });
    setSelectedItem(null);
  };

  return (
    <section className="space-y-6 rounded-lg border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold">Itens corrigidos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajuste a quantidade ou o preço dos itens existentes. Também pode
          acrescentar um produto ou serviço do catálogo.
        </p>
      </div>

      <div className="grid gap-3 rounded-lg border border-dashed bg-muted/20 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <AsyncCreatableSelectField
          endpoint="/items"
          label="Adicionar produto ou serviço"
          placeholder="Pesquisar no catálogo..."
          value={selectedItem}
          onChange={setSelectedItem}
          displayFields={["name", "description"]}
          minChars={2}
          formatCreateLabel={(value) => `O item "${value}" não existe no catálogo`}
        />
        <Button
          type="button"
          onClick={handleAddItem}
          disabled={!canAdd}
          className="gap-2 md:min-w-32"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
        {selectedAlreadyExists && (
          <p className="text-sm text-destructive md:col-span-2">
            Este item já faz parte do documento corrigido.
          </p>
        )}
        {selectedItem?.__isNew__ && (
          <p className="text-sm text-muted-foreground md:col-span-2">
            Crie primeiro o item na página de produtos ou serviços.
          </p>
        )}
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid gap-4 rounded-lg border p-4 md:grid-cols-[minmax(180px,1fr)_150px_190px_140px_40px] md:items-end"
          >
            <Input
              {...register(`invoiceBody.items.${index}.name`)}
              label="Item"
              readOnly
              error={errors?.invoiceBody?.items?.[index]?.name?.message}
            />

            <Controller
              control={control}
              name={`invoiceBody.items.${index}.quantity`}
              render={({ field: quantityField, fieldState }) => (
                <Input
                  type="quantity"
                  label="Quantidade"
                  min={1}
                  value={Number(quantityField.value || 1)}
                  onChange={(event) =>
                    quantityField.onChange(Math.max(1, Number(event.target.value)))
                  }
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name={`invoiceBody.items.${index}.price`}
              render={({ field: priceField, fieldState }) => (
                <InputCurrency
                  ref={priceField.ref}
                  label="Preço unitário"
                  value={priceField.value}
                  onValueChange={priceField.onChange}
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  error={fieldState.error?.message}
                />
              )}
            />

            <div className="space-y-1">
              <span className="text-sm font-medium">Total</span>
              <div className="flex h-10 items-center justify-end rounded-md bg-muted px-3 font-mono text-sm font-semibold">
                {formatCurrency(
                  Number(watchedItems?.[index]?.quantity || 0) *
                    Number(watchedItems?.[index]?.price || 0),
                )}
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => remove(index)}
              aria-label={`Remover ${watchedItems?.[index]?.name || "item"}`}
              title="Remover item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="rounded-lg border border-dashed bg-muted/10 p-8 text-center text-sm text-muted-foreground">
            O documento corrigido deve conter, pelo menos, um item.
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <h3 className="text-sm font-semibold">Valor da nota de crédito</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal a creditar</span>
              <span>{formatCurrency(creditNoteSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Imposto</span>
              <span>{formatCurrency(creditNoteTaxAmount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span>Total a creditar</span>
              <span>{formatCurrency(creditNoteTotal)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/20 p-4">
          <h3 className="text-sm font-semibold">Documento após a correcção</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(invoiceBodySubtotal)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span>Total final</span>
              <span>{formatCurrency(invoiceBodyTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
