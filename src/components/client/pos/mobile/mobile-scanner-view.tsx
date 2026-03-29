"use client";

import { useCallback } from "react";
import { Icon, ScrollArea } from "@/components";
import { formatCurrency } from "@/utils";
import { useInvoiceTotals } from "@/hooks";
import { CartItem } from "@/types";
import { cn } from "@/lib/utils";
import { useCameraScanner } from "@/hooks/items";

const SCANNER_REGION_ID = "mobile-scanner-region";

interface MobileScannerViewProps {
  onScan: (barcode: string) => void;
  onPay: () => void;
  cartItems: CartItem[];
  onOpenMenu: () => void;
}

export function MobileScannerView({
  onScan,
  onPay,
  cartItems,
  onOpenMenu,
}: MobileScannerViewProps) {
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const totals = useInvoiceTotals({
    items: cartItems.map((item) => ({
      unitPrice: item.price || 0,
      quantity: item.qty,
      tax: item.tax?.rate || 0,
    })),
    retention: 0,
    discount: 0,
  });

  const { isScanning, start, stop } = useCameraScanner(SCANNER_REGION_ID);

  const scannerDivRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        start(onScan);
      } else {
        stop();
      }
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className="flex flex-col h-full bg-black relative text-white">
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/50 to-transparent">
        <button
          onClick={onOpenMenu}
          className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center"
        >
          <Icon name="Menu" size={20} />
        </button>
        <button
          onClick={onPay}
          className="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center"
        >
          Pagar
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden bg-muted/10">
        <div ref={scannerDivRef} id={SCANNER_REGION_ID} className="w-full h-full object-cover" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
            <div className="absolute top-[-2px] left-[-2px] w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
            <div className="absolute top-[-2px] right-[-2px] w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
            <div className="absolute bottom-[-2px] left-[-2px] w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
            <div className="absolute bottom-[-2px] right-[-2px] w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/50 shadow-[0_0_15px_rgba(153,86,246,0.8)] animate-[scan-line_2s_ease-in-out_infinite]" />
          </div>
        </div>

        <div className="absolute bottom-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 space-y-0.5">
          <p className="text-xs text-white/70">Itens : {totalItems < 10 ? `0${totalItems}` : totalItems}</p>
          <p className="text-sm font-bold">Total : {formatCurrency(totals.total)}</p>
        </div>
      </div>

      <div className="bg-card rounded-t-[32px] p-6 text-card-foreground h-[40%] flex flex-col">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground mb-4 px-2">
          <span className="w-1/3">SKU</span>
          <span className="w-1/4 text-center">Quantidade</span>
          <span className="w-1/6 text-center">$</span>
          <span className="w-1/6 text-right">Total</span>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs px-2">
                  <div className="w-1/3 overflow-hidden">
                    <p className="font-bold truncate">{item.sku || "N/A"}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{item.name}</p>
                  </div>
                  <span className="w-1/4 text-center">{item.qty}</span>
                  <span className="w-1/6 text-center">{formatCurrency(item.price || 0)}</span>
                  <span className="w-1/6 text-right font-bold">{formatCurrency((item.price || 0) * item.qty)}</span>
                </div>
              ))
            ) : (
              <div className="h-20 flex items-center justify-center text-muted-foreground text-sm italic">
                Nenhum item digitalizado ainda
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-center pt-4">
          <button
            onClick={isScanning ? stop : () => start(onScan)}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl",
              isScanning ? "bg-destructive text-white" : "bg-primary text-white",
            )}
          >
            {isScanning ? <Icon name="Square" size={24} /> : <Icon name="ScanLine" size={28} />}
          </button>
        </div>
      </div>
    </div>
  );
}
