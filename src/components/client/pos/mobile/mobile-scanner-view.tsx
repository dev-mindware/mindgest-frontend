"use client";

import { useCallback } from "react";
import { Icon, ScrollArea } from "@/components";
import { formatCurrency } from "@/utils";
import { useInvoiceTotals } from "@/hooks";
import { CartItem } from "@/types";
import { cn } from "@/lib/utils";
import { useCameraScanner } from "@/hooks/items";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { playScannerBeep } from "@/utils/audio";

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
        start((code) => {
          playScannerBeep();
          onScan(code);
        });
      } else {
        stop();
      }
    },
    [onScan, start, stop]
  );

  return (
    <div className="flex flex-col h-full bg-background relative text-foreground font-sans">
      {/* Header Minimalista */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-30 bg-background/60 backdrop-blur-md border-b border-border/40">
        <button
          onClick={onOpenMenu}
          className="p-2 rounded-lg bg-secondary/50 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Scanner</span>
          <span className="text-xs font-medium text-foreground">Captura Activa</span>
        </div>

        <button
          onClick={onPay}
          className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 active:scale-95 transition-transform"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Pagar</span>
        </button>
      </div>

      {/* Camera Viewport */}
      <div className="flex-1 relative overflow-hidden bg-black">
        <div 
          ref={scannerDivRef} 
          id={SCANNER_REGION_ID} 
          className="w-full h-full object-cover" 
        />

        {/* Rectângulo de Guia (Foco) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-40 border-2 border-white/30 rounded-2xl relative">
            {/* Cantos realçados */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
            
            {/* Linha de scan minimalista */}
            <div className="absolute top-0 left-0 right-0 h-px bg-primary/40 shadow-[0_0_8px_rgba(var(--primary),0.5)] animate-[scan-move_3s_ease-in-out_infinite]" />
          </div>
        </div>

        {/* Instrução Minimalista */}
        <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none">
          <p className="text-[11px] font-medium text-white/70 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
            Posicione o código no centro
          </p>
        </div>
      </div>

      {/* Listagem de Itens Minimalista */}
      <div className="bg-background p-6 h-[40%] flex flex-col border-t border-border shadow-2xl z-20 overflow-hidden">
        <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Artigos</h3>
            <p className="text-[10px] text-muted-foreground">{totalItems} itens no carrinho</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold tracking-tighter text-muted-foreground leading-none mb-1">Total</p>
            <p className="text-lg font-black text-primary leading-none">{formatCurrency(totals.total)}</p>
          </div>
        </div>

        <ScrollArea className="flex-1 -mx-2 px-2">
          <div className="space-y-2">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/40"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-bold text-xs truncate text-foreground">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{item.sku || "Sem SKU"} • x{item.qty}</p>
                  </div>
                  <div className="text-right underline decoration-primary/30 decoration-2 underline-offset-4">
                    <p className="text-xs font-bold text-foreground">{formatCurrency((item.price || 0) * item.qty)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-24 flex flex-col items-center justify-center text-muted-foreground/30 gap-2 border border-dashed border-border rounded-xl">
                <Icon name="Barcode" size={24} />
                <p className="text-[10px] font-medium uppercase tracking-widest">Aguardando leitura</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Botão de Controlo Pequeno e Minimalista */}
        <div className="flex justify-center pt-4">
          <button
            onClick={isScanning ? stop : () => start(onScan)}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all border shadow-sm active:scale-90",
              isScanning 
                ? "bg-destructive/10 border-destructive/20 text-destructive" 
                : "bg-secondary border-border text-foreground hover:bg-secondary/80"
            )}
          >
            {isScanning ? (
              <Icon name="Square" size={16} />
            ) : (
              <Icon name="ScanLine" size={18} />
            )}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan-move {
          0%, 100% { top: 5%; }
          50% { top: 95%; }
        }
      `}</style>
    </div>
  );
}
