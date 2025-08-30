import { useState } from "react";
import { Button, Input, SelectField } from "@/components";
import { UseFieldArrayReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { ReceiptFormData } from "@/schemas";
import { EmptyState } from "../empty-state";

interface InvoiceItemsProps {
  fieldArray: UseFieldArrayReturn<ReceiptFormData, "items">;
}

export function ReceiptItems({ fieldArray }: InvoiceItemsProps) {
  const { fields, append, remove } = fieldArray;
  const [itemDraft, setItemDraft] = useState({
    description: "",
    quantity: 1,
    unitPrice: 0,
    tax: 0,
  });

  function handleAddItem() {
    const { description, quantity, unitPrice, tax } = itemDraft;
    if (!description) return;

    const taxAmount = quantity * unitPrice * (tax / 100);
    const total = quantity * unitPrice + taxAmount;

    append({
      description,
      quantity,
      unitPrice,
      tax,
      total,
    });

    setItemDraft({ description: "", quantity: 1, unitPrice: 0, tax: 0 });
  }

  return (
    <div className="space-y-6">
      <div className="w-full flex items-center justify-between">
        <h3 className="text-lg font-semibold">Itens</h3>

        <div className="flex items-end">
          <Button className="w-full" type="button" onClick={handleAddItem}>
            Adicionar Item
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Descrição"
            placeholder="Nome do produto"
            value={itemDraft.description}
            onChange={(e) =>
              setItemDraft({ ...itemDraft, description: e.target.value })
            }
            className="w-full"
          />

          <Input
            type="quantity"
            label="Quantidade"
            value={itemDraft.quantity}
            onChange={(e) =>
              setItemDraft({ ...itemDraft, quantity: Number(e.target.value) })
            }
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="number"
            label="Preço Unitário"
            value={itemDraft.unitPrice}
            onChange={(e) =>
              setItemDraft({ ...itemDraft, unitPrice: Number(e.target.value) })
            }
            className="w-full"
          />

          <SelectField
            label="Imposto (IVA)"
            value={itemDraft.tax}
            onValueChange={(value) =>
              setItemDraft({ ...itemDraft, tax: Number(value) })
            }
            options={[
              { value: 0, label: "0%" },
              { value: 5, label: "5%" },
              { value: 7, label: "7%" },
              { value: 14, label: "14%" },
              { value: 20, label: "20%" },
            ]}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {fields.length === 0 && <EmptyState />}
        {fields.map((item, index) => (
          <Badge
            key={item.id}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-full"
            variant="default"
          >
            {item.description} - <strong>{item.total} Kz</strong>
            <button
              type="button"
              onClick={() => remove(index)}
              className="ml-2 text-red-500 hover:text-red-700 text-lg leading-none"
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
