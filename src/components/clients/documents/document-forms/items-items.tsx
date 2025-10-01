import { useState } from "react";
import { Button, Input, RequestError, RHFSelect, SelectField, Tabs, TabsList, TabsTrigger } from "@/components";
import { Control, UseFieldArrayReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { InvoiceFormData } from "@/schemas";
import { EmptyState } from "../empty-state";
import { TabsContent } from "@radix-ui/react-tabs";
import { useGetCategories } from "@/hooks";

interface InvoiceItemsProps {
  fieldArray: UseFieldArrayReturn<InvoiceFormData, "items">;
  control: Control<InvoiceFormData>; 
}



export function InvoiceItems({ fieldArray, control }: InvoiceItemsProps) {
  const { fields, append, remove } = fieldArray;
  const { categories, isLoading, error, refetch } = useGetCategories();
  const [itemDraft, setItemDraft] = useState({
    description: "",
    quantity: 1,
    unitPrice: 0,
    tax: 0,
    discount: 0,
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

    setItemDraft({ description: "", quantity: 1, unitPrice: 0, tax: 0, discount: 0 });
  }

  if (isLoading) return <p>Carregando categorias...</p>;
    if (error)
      return (
        <RequestError
          refetch={refetch}
          message="Ocorreu um erro ao carregar as categorias"
        />
      );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-lg font-semibold">Itens</h3>
      </div>
      <Tabs className="space-y-6">
        <TabsList className="flex justify-center md:justify-start">
          <TabsTrigger value="manual">Inserção Manual</TabsTrigger>
          <TabsTrigger value="predefined">Inserção Predefinida</TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              <Input
                type="number"
                label="Desconto"
                startIcon="Percent"
                value={itemDraft.discount}
                onChange={(e) =>
                  setItemDraft({ ...itemDraft, discount: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <Button type="button" onClick={handleAddItem}>
              Adicionar Item
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="predefined" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">  
            <RHFSelect
              name="categoryId"
              label="Categoria"
              options={categories}
              control={control}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              <Input
                type="number"
                label="Desconto"
                startIcon="Percent"
                value={itemDraft.discount}
                onChange={(e) =>
                  setItemDraft({ ...itemDraft, discount: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
        </TabsContent>
      </Tabs>

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
              className="ml-2 text-lg leading-none text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
