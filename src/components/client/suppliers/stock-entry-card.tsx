"use client"
import { useState } from "react";
import { StockEntry } from "@/types";
import { Icon } from "@/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils";
import { StockEntryItemsTable } from "./stock-entry-table";

export function StockEntryCard({ entry }: { entry: StockEntry }) {
  const [expanded, setExpanded] = useState(true);
  const totalQty = entry.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Card className="border shadow-none overflow-hidden transition-all">
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Icon name="FileText" className="w-3.5 h-3.5 shrink-0" />
                <CardTitle className="text-sm font-semibold text-foreground">
                  {entry.number ?? "N/A"}
                </CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs shrink-0">
                <Icon name="Store" className="w-3 h-3 mr-1" />
                {entry.store.name}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon name="Calendar" className="w-3 h-3 shrink-0" />
              <span>{formatDate(entry.entryDate)}</span>
            </div>
            {entry.notes && (
              <p className="text-muted-foreground italic border-l-2 border-muted pl-2 mt-0.5">
                {entry.notes}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-base font-bold text-foreground">
                {formatCurrency(entry.totalAmount)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setExpanded((p) => !p)}
              aria-label={expanded ? "Recolher itens" : "Expandir itens"}
            >
              <Icon
                name={expanded ? "ChevronUp" : "ChevronDown"}
                className="w-4 h-4 transition-transform"
              />
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <>
          <Separator
            className="mx-4 w-auto"
            style={{ marginLeft: 16, marginRight: 16 }}
          />
          <CardContent className="pt-3 px-4 pb-4">
            <StockEntryItemsTable items={entry.items} />
          </CardContent>
        </>
      )}
    </Card>
  );
}