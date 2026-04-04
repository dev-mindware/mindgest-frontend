"use client";
import {
  Control,
  UseFormRegister,
  useWatch,
  Controller,
} from "react-hook-form";
import { CreditNoteFormData } from "@/schemas";
import { Input, InputCurrency, Separator, Button } from "@/components";
import { Trash2 } from "lucide-react";
import { formatCurrency, parseCurrency } from "@/utils";

interface ItemsSummarySectionProps {
  control: Control<CreditNoteFormData>;
  register: UseFormRegister<CreditNoteFormData>;
  fields: any[];
  remove: (index: number) => void;
}

export function ItemsSummarySection({
  control,
  register,
  fields,
  remove,
}: ItemsSummarySectionProps) {
  const watchedItems = useWatch({ control, name: "invoiceBody.items" });
  const creditNoteSubtotal = useWatch({ control, name: "creditNote.subtotal" });
  const creditNoteTaxAmount = useWatch({
    control,
    name: "creditNote.taxAmount",
  });
  const creditNoteTotal = useWatch({ control, name: "creditNote.total" });

  const invoiceBodySubtotal = useWatch({
    control,
    name: "invoiceBody.subtotal",
  });
  const invoiceBodyTotal = useWatch({ control, name: "invoiceBody.total" });

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Itens e Correções</h3>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
          <table className="w-full">
            <thead className="bg-card border-border">
              <tr className="text-foreground">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Item
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                  Qtd.
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                  Preço Unit.
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 w-[60px]" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td className="px-4 py-3">
                    <Input
                      {...register(`invoiceBody.items.${index}.name`)}
                      className="h-9 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-right w-24">
                    <Input
                      type="number"
                      {...register(`invoiceBody.items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      className="h-9 text-sm text-right"
                    />
                  </td>
                  <td className="px-4 py-3 text-right w-40">
                    <Controller
                      control={control}
                      name={`invoiceBody.items.${index}.price`}
                      render={({ field: controllerField, fieldState }) => (
                        <InputCurrency
                          label="Preço Unitário"
                          placeholder="Preço Unitário"
                          ref={controllerField.ref}
                          value={controllerField.value}
                          onValueChange={(value) =>
                            controllerField.onChange(value)
                          }
                          decimalScale={2}
                          fixedDecimalScale
                          allowNegative={false}
                          className="h-9 text-sm text-right font-mono"
                        />
                      )}
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-sm">
                    {formatCurrency(
                      (watchedItems?.[index]?.quantity || 0) *
                        (watchedItems?.[index]?.price || 0),
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {fields.length === 0 && (
            <div className="p-8 text-center text-muted-foreground bg-muted/10 border-t border-dashed">
              Nenhum item restante. Por favor, adicione itens ou anule o
              documento.
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-4 rounded-lg bg-primary/5 space-y-2">
          <h4 className="font-semibold text-sm uppercase">
            Resumo da Nota de Crédito (Delta)
          </h4>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(creditNoteSubtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Imposto:</span>
            <span>{formatCurrency(creditNoteTaxAmount)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Valor a Creditar:</span>
            <span>{formatCurrency(creditNoteTotal)}</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-orange-500/5 space-y-2">
          <h4 className="font-semibold text-sm uppercase">
            Novo Estado do Documento
          </h4>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(invoiceBodySubtotal)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total Final:</span>
            <span>{formatCurrency(invoiceBodyTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
