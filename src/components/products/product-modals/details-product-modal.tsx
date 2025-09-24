"use client";
import { useModal } from "@/stores/use-modal-store";
import { Button, GlobalModal, Icon } from "@/components";
import { currentProductStore } from "@/stores";
import { formatPrice } from "@/utils";
import { StatusBadge } from "../product-status-badge";

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (!value) return null;
  return (
    <p className="text-sm text-muted-foreground">
      {label}: <span className="font-medium text-foreground">{value}</span>
    </p>
  );
}

export function DetailsProductModal() {
  const { closeModal } = useModal();
  const { currentProduct } = currentProductStore();

  if (!currentProduct) return null;

  return (
    <GlobalModal
      canClose
      id="view-product"
      title={
        <>
          <div className="flex items-center justify-center mx-auto rounded-full w-20 h-20 bg-primary/10">
            <Icon name="Package" className="w-10 h-10 text-primary" />
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold">{currentProduct.name}</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground">
                SKU: {currentProduct.sku}
              </span>
              <StatusBadge status={currentProduct.status!} />
            </div>
          </div>
        </>
      }
      className="!max-h-[85vh] w-full max-w-md"
      footer={
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => closeModal("view-product")}>
            Fechar
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <section className="space-y-2">
          <DetailRow label="Categoria" value={currentProduct.categoryId} />
          <DetailRow label="Descrição" value={currentProduct.description} />
        </section>

        <section className="space-y-2">
          <DetailRow
            label="Data de Expiração"
            value={
              currentProduct.expiryDate
                ? `${currentProduct.expiryDate} dias`
                : undefined
            }
          />
          <DetailRow label="Estoque Mínimo" value={currentProduct.minStock} />

          <p className="text-sm text-muted-foreground">
            Preço:
            <span className="ml-2 text-lg font-semibold text-primary">
              {formatPrice(currentProduct.price ?? 0)}
            </span>
          </p>
        </section>
      </div>
    </GlobalModal>
  );
}
