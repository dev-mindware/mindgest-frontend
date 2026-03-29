"use client";

import { useCallback } from "react";
import { Icon, ScrollArea } from "@/components";
import { formatCurrency } from "@/utils";
import { useInvoiceTotals } from "@/hooks";
import { CartItem } from "@/types";
import { cn } from "@/lib/utils";
import { useCameraScanner } from "@/hooks/items";
import { ChevronLeft, ShoppingCart, Zap } from "lucide-react";

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
    <div className="flex flex-col h-full bg-black relative text-white transition-all duration-300">
      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-30 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={onOpenMenu}
          className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center active:scale-90 transition-transform"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Modo de Scan</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold">Câmara Activa</span>
          </div>
        </div>

        <button
          onClick={onPay}
          className="h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Pagar</span>
        </button>
      </div>

      {/* Camera Fullscreen Viewport */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          ref={scannerDivRef} 
          id={SCANNER_REGION_ID} 
          className="w-full h-full object-cover grayscale-[0.2] brightness-110" 
        />

        {/* Floating Instruction */}
        <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-4 pointer-events-none z-20">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 shadow-2xl">
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold tracking-wide">Lê em qualquer lugar do ecrã</span>
          </div>
        </div>

        {/* Subtle Edge Glow for Active Scan Area */}
        <div className="absolute inset-0 border-[20px] border-transparent shadow-[inset_0_0_100px_rgba(0,0,0,0.4)] pointer-events-none" />
      </div>

      {/* Cart Items List */}
      <div className="bg-zinc-900 rounded-t-[40px] p-8 text-white h-[45%] flex flex-col shadow-2xl border-t border-white/5 relative z-20">
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
        
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            Lista de Artigos 
            <span className="text-primary text-sm font-medium bg-primary/10 px-2 py-0.5 rounded-lg">
              {totalItems}
            </span>
          </h3>
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Total Geral</p>
            <p className="text-xl font-black text-primary">{formatCurrency(totals.total)}</p>
          </div>
        </div>

        <ScrollArea className="flex-1 -mx-2 px-2">
          <div className="space-y-3 pb-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-bold text-sm truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-white/40 font-mono bg-white/5 px-1.5 py-0.5 rounded uppercase">{item.sku || "Sem SKU"}</span>
                      <span className="text-[10px] text-primary font-bold">x{item.qty}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{formatCurrency((item.price || 0) * item.qty)}</p>
                    <p className="text-[10px] text-white/40 leading-none">{formatCurrency(item.price || 0)} p/un</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-white/20 gap-3 border-2 border-dashed border-white/5 rounded-3xl">
                <Icon name="Barcode" size={40} />
                <p className="text-sm italic font-medium">Capture um código para começar</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Control Button */}
        <div className="flex justify-center pt-6">
          <button
            onClick={isScanning ? stop : () => start(onScan)}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 group relative",
              isScanning ? "bg-red-500/10 border-2 border-red-500 text-red-500" : "bg-primary text-primary-foreground"
            )}
          >
            {isScanning ? (
              <Icon name="Square" size={32} className="fill-current" />
            ) : (
              <Zap size={36} className="fill-current animate-pulse" />
            )}
            
            {!isScanning && (
              <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 -z-10" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
