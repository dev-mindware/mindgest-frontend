import { Trash2 } from "lucide-react";
import { Button } from "@/components";
import { formatCurrency } from "@/utils";

interface ItemsTableProps {
  items: any[];
  onRemove: (index: number) => void;
}

export function ItemsTable({ items, onRemove }: ItemsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border shadow-sm">
      <table className="w-full">
        <thead className="bg-card">
          <tr>
            <Header>Item</Header>
            <Header>Tipo</Header>
            <Header align="right">Qtd.</Header>
            <Header align="right">Preço Unit.</Header>
            <Header align="right">Subtotal</Header>
            <th className="w-[60px]" />
          </tr>
        </thead>

        <tbody className="divide-y">
          {items.map((item, index) => (
            <tr key={item.id}>
              <td className="px-4 py-3">{item.description}</td>
              <td className="px-4 py-3">
                {item.type === "PRODUCT" ? "Produto" : "Serviço"}
              </td>
              <td className="px-4 py-3 text-right">
                {item.quantity}
              </td>
              <td className="px-4 py-3 text-right">
                {formatCurrency(item.unitPrice)}
              </td>
              <td className="px-4 py-3 text-right font-medium">
                {formatCurrency(item.unitPrice * item.quantity)}
              </td>
              <td className="px-4 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Header({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}
