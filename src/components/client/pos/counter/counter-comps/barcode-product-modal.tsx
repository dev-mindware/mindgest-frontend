import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductMock } from "./data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Icon, GlobalModal } from "@/components";
import { useModal } from "@/stores/modal/use-modal-store";
import { formatCurrency } from "@/utils";

interface BarcodeProductModalProps {
  product: ProductMock | null;
  onConfirm: (quantity: number) => void;
}

export const MODAL_BARCODE_PRODUCT_ID = "barcode-product-modal";

export function BarcodeProductModal({
  product,
  onConfirm,
}: BarcodeProductModalProps) {
  const { open, closeModal } = useModal();
  const isOpen = open[MODAL_BARCODE_PRODUCT_ID] || false;
  const [quantity, setQuantity] = useState("1");

  // Reset quantity when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity("1");
    }
  }, [isOpen, product]);

  const handleConfirm = () => {
    const qty = parseInt(quantity, 10);
    if (!isNaN(qty) && qty > 0) {
      onConfirm(qty);
      closeModal(MODAL_BARCODE_PRODUCT_ID);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  if (!product) return null;

  return (
    <GlobalModal
      id={MODAL_BARCODE_PRODUCT_ID}
      className="w-max p-0 overflow-hidden"
      title="Produto Identificado"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
          <Avatar className="h-20 w-20 rounded-md border shadow-sm">
            <AvatarImage src={product.image} className="object-cover" />
            <AvatarFallback className="rounded-md bg-primary/10 text-primary text-2xl font-bold">
              {product.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Icon name="Barcode" size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {product.sku}
              </span>
            </div>
            <h3 className="font-bold text-xl leading-tight">{product.name}</h3>
            <p className="font-black text-primary text-lg">
              {formatCurrency(product.price || 0)}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label
            htmlFor="quantity"
            className="text-sm font-bold flex items-center gap-2"
          >
            <Icon name="Hash" size={16} className="text-primary" />
            Quantidade a Adicionar
          </label>
          <div className="flex items-center gap-3">
            <Input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              autoFocus
              onKeyDown={handleKeyDown}
              min="1"
            />
            <Button
              onClick={handleConfirm}
              size="icon"
            >
              <Icon name="Check" size={28} />
            </Button>
          </div>

          {product.reserved > 0 && (
            <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-success/5 border border-success/10 text-success text-xs font-medium">
              <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Estoque disponível: {product.reserved}
            </div>
          )}
        </div>

        <div className="pt-2">
          <Button
            variant="ghost"
            className="w-full text-muted-foreground hover:bg-muted"
            onClick={() => closeModal(MODAL_BARCODE_PRODUCT_ID)}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </GlobalModal>
  );
}
