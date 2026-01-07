import React, { memo } from "react";
import { ItemRow } from "./item-row";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components";
import { ChevronDown, Plus, Barcode, Keyboard } from "lucide-react";
import { useModal } from "@/stores/modal/use-modal-store";
import { BarcodeScannerModal, BARCODE_SCANNER_MODAL_ID } from "../../../items/products/product-modals/barcode-scanner-modal";

interface ItemListProps {
  items: any[];
  onRemove: (index: number) => void;
}

export const ItemList = memo<ItemListProps>(({ items, onRemove }) => {

  const { openModal } = useModal();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">
          Lista de Itens
        </h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Produto
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => openModal("add-product")}
              className="flex items-center gap-2"
            >
              <Keyboard className="h-4 w-4" />
              Manual
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openModal(BARCODE_SCANNER_MODAL_ID)}
              className="flex items-center gap-2"
            >
              <Barcode className="h-4 w-4" />
              Código de Barra
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
            {items.map((item, index) => (
              <ItemRow
                key={item.id || index}
                item={item}
                index={index}
                onRemove={onRemove}
              />
            ))}
          </tbody>
        </table>
      </div>

      <BarcodeScannerModal />
    </div>
  );
});


ItemList.displayName = "ItemList";
