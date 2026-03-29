import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { Icon, GlobalModal } from "@/components";
import { useModal } from "@/stores/modal/use-modal-store";
import { formatCurrency } from "@/utils";
import { Product } from "@/types";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";

interface BarcodeScannerModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  scannedProduct: Product | null;
  onConfirm: (quantity: number) => void;
  onCancel?: () => void;
}

export const MODAL_BARCODE_PRODUCT_ID = "barcode-product-modal";

export function BarcodeProductScanner({
  scannedProduct,
  onConfirm,
}: BarcodeScannerModalProps) {
  const { open: modalsOpen, closeModal } = useModal();
  const isOpen = modalsOpen[MODAL_BARCODE_PRODUCT_ID] || false;

  const [quantity, setQuantity] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 150);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (quantity < 1) return;
    onConfirm(quantity);
    closeModal(MODAL_BARCODE_PRODUCT_ID);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
    if (e.key === "Escape") {
      closeModal(MODAL_BARCODE_PRODUCT_ID);
    }
  };

  if (!scannedProduct) return null;

  return (
    <GlobalModal
      id={MODAL_BARCODE_PRODUCT_ID}
      title=""
      description=""
      className="sm:max-w-[380px] p-0 overflow-hidden border-none shadow-2xl bg-background"
    >
      <div className="relative">
        {/* Close Button UI Minimalista */}
        <button 
          onClick={() => closeModal(MODAL_BARCODE_PRODUCT_ID)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 flex flex-col items-center gap-6">
          {/* Header & Product Info */}
          <div className="w-full text-center space-y-4">
            <div className="flex justify-center">
              {scannedProduct.image ? (
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-border/50 shadow-sm">
                  <Image
                    src={scannedProduct.image}
                    alt={scannedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-secondary/30 flex items-center justify-center border border-dashed border-border">
                  <Icon name="Package" size={32} className="text-muted-foreground/50" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-lg tracking-tight px-2">{scannedProduct.name}</h3>
              <p className="text-primary font-black text-xl">
                {formatCurrency(scannedProduct.price || 0)}
              </p>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-60">
                SKU: {scannedProduct.sku || "N/A"}
              </div>
            </div>
          </div>

          {/* Quantity Selector Minimalista */}
          <div className="w-full space-y-3 pt-4 border-t border-border/40">
            <Label htmlFor="qty" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground block text-center">
              Quantidade a Adicionar
            </Label>
            
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-xl active:scale-90 transition-transform"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>

              <Input
                id="qty"
                ref={inputRef}
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                onKeyDown={handleKeyDown}
                className="h-12 w-20 text-center text-lg font-bold bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
                min={1}
              />

              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-xl active:scale-90 transition-transform"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full grid grid-cols-2 gap-3 pt-4">
            <Button 
              variant="ghost" 
              className="h-12 rounded-xl font-bold text-muted-foreground"
              onClick={() => closeModal(MODAL_BARCODE_PRODUCT_ID)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm}
              className="h-12 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Adicionar</span>
            </Button>
          </div>
        </div>
      </div>
    </GlobalModal>
  );
}
