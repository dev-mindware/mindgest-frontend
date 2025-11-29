import { useState, useMemo } from "react";
import { Button, EmptyState, Input, SelectField, Separator } from "@/components";
import { Control, UseFieldArrayReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReceiptInvoiceFormData } from "@/schemas";
import { InputFetch } from "@/components/common/input-fetch";
import { Trash2, Package } from "lucide-react";

interface InvoiceItemsProps {
  fieldArray: UseFieldArrayReturn<ReceiptInvoiceFormData, "items">;
  control: Control<ReceiptInvoiceFormData>;
}

export function InvoiceItems({ fieldArray, control }: InvoiceItemsProps) {
  const { fields, append, remove } = fieldArray;
  const [itemDraft, setItemDraft] = useState({
    name: "",
    quantity: 1,
    price: 0,
    tax: 0,
    discount: 0,
  });

  const [globalTax, setGlobalTax] = useState(0);
  const [globalDiscount, setGlobalDiscount] = useState(0);

  const [isItemFromAPI, setIsItemFromAPI] = useState(false);

  // Cálculo dos totais
  const totals = useMemo(() => {
    const subtotal = fields.reduce((acc, item) => {
      return acc + (item.unitPrice * item.quantity);
    }, 0);

    const taxAmount = subtotal * (globalTax / 100);
    const discountAmount = subtotal * (globalDiscount / 100);
    const total = subtotal + taxAmount - discountAmount;

    return { subtotal, taxAmount, discountAmount, total };
  }, [fields, globalTax, globalDiscount]);

  function handleAddItem() {
    const { name, quantity, price } = itemDraft;
    if (!name || quantity <= 0 || price < 0) return;

    append({
      description: name,
      unitPrice: price,
      quantity,
      tax: globalTax,
      discount: globalDiscount,
      total: price * quantity,
    });

    // Reseta o formulário
    setItemDraft({
      name: "",
      quantity: 1,
      price: 0,
      tax: globalTax,
      discount: globalDiscount,
    });
    setIsItemFromAPI(false);
  }

  const handleItemFetchChange = (id: string | number, fullObject: any | null) => {
    if (fullObject && fullObject.price) {
      const price = parseFloat(fullObject.price);
      setItemDraft((prev) => ({
        ...prev,
        name: fullObject.name || "",
        price: price,
        type: fullObject.type || "PRODUCT",
      }));
      setIsItemFromAPI(true);
    } else {
      setItemDraft((prev) => ({
        ...prev,
        name: typeof id === "string" ? id : "",
        price: 0,
      }));
      setIsItemFromAPI(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Itens da Fatura</h3>
      </div>

      <Separator />

      {/* Formulário de Adição */}
        <div className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <InputFetch
                startIcon="ShoppingBasket"
                label="Nome do Item"
                placeholder="Nome do produto ou serviço"
                endpoint="/items"
                displayFields={["name", "description"]}
                onValueChange={handleItemFetchChange}
                minChars={1}
                debounceMs={300}
              />

               <Input
                type="quantity"
                label="Quantidade"
                min="1"
                value={itemDraft.quantity}
                onChange={(e) =>
                  setItemDraft({ ...itemDraft, quantity: Number(e.target.value) })
                }
                className="w-full"
              />

              <Input
                type="number"
                label="Preço Unitário"
                min="0"
                step="0.01"
                value={itemDraft.price}
                onChange={(e) =>
                  setItemDraft({ ...itemDraft, price: Number(e.target.value) })
                }
                className="w-full"
                disabled={isItemFromAPI}
              />
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={handleAddItem}>
                Adicionar Item
              </Button>
            </div>
          </div>
        </div>

      {/* Lista de Itens */}
      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center">
            <EmptyState icon="ShoppingBasket"/>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Tabela de Itens */}
            <div className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50 ">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Item</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Tipo</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Qtd</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Preço Unit.</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Subtotal</th>
                      <th className="px-4 py-3 w-[50px]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {fields.map((item, index) => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium">{item.description}</td>
                        <td className="px-4 py-3">
                        </td>
                        <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-right">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          {/* Card de Totais */}
            <div className="pt-6">
              <div className="space-y-4">
                {/* Campos de IVA e Desconto */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pb-4">
                  <SelectField
                    label="Imposto (IVA) sobre o total"
                    value={globalTax}
                    onValueChange={(value) => setGlobalTax(Number(value))}
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
                    label="Desconto (%)"
                    startIcon="Percent"
                    min="0"
                    max="100"
                    step="0.01"
                    value={globalDiscount}
                    onChange={(e) => setGlobalDiscount(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Resumo dos Totais */}
                <div className="flex justify-start">
                <div className="space-y-3 min-w-70 border border-dashed border-muted p-4 rounded-md">
                  <div className="flex justify-between text-md gap-4">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  {globalTax > 0 && (
                    <div className="flex justify-between text-md gap-4">
                      <span className="text-muted-foreground">IVA ({globalTax}%):</span>
                      <span className="font-medium">
                        +{formatCurrency(totals.taxAmount)}
                      </span>
                    </div>
                  )}
                  {globalDiscount > 0 && (
                    <div className="flex justify-between text-md gap-4">
                      <span className="text-muted-foreground">Desconto ({globalDiscount}%):</span>
                      <span className="font-medium text-destructive">
                        -{formatCurrency(totals.discountAmount)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-xl font-bold gap-4">
                    <span>Total:</span>
                    <span className="text-2xl text-primary">{formatCurrency(totals.total)}</span>
                  </div>
                </div>
                </div>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}