import { cn } from "@/lib/utils";
import { StockEntryItem } from "@/types";
import { Icon } from "@/components";
import { formatCurrency } from "@/utils/format-currency";
import { Badge } from "@/components/ui/badge";


export function StockEntryItemsTable({ items }: { items: StockEntryItem[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 border-b border-border/60">
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">
              Produto
            </th>
            <th className="text-center px-4 py-2.5 font-medium text-muted-foreground w-20">
              Qtd.
            </th>
            <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">
              Custo/Und.
            </th>
            <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">
              Custo Anterior
            </th>
            <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, idx) => {
            const total = row.costAtEntry * row.quantity;
            const diff = row.costAtEntry - row.previousCost;
            const isUp = diff > 0;
            const isDown = diff < 0;
            return (
              <tr
                key={row.id}
                className={cn(
                  "border-t border-border/40 transition-colors hover:bg-muted/20",
                  idx % 2 === 0 && "bg-background",
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {row.item.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {row.item.sku}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant="secondary" className="font-mono text-xs">
                    ×{row.quantity}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatCurrency(row.costAtEntry)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-muted-foreground text-xs">
                      {formatCurrency(row.previousCost)}
                    </span>
                    {diff !== 0 && (
                      <span
                        className={cn(
                          "text-xs font-semibold flex items-center gap-0.5",
                          isUp && "text-red-500 dark:text-red-400",
                          isDown && "text-emerald-600 dark:text-emerald-400",
                        )}
                      >
                        <Icon
                          name={isUp ? "TrendingUp" : "TrendingDown"}
                          className="w-3 h-3"
                        />
                        {isUp ? "+" : ""}
                        {formatCurrency(Math.abs(diff))}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-bold">
                  {formatCurrency(total)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

