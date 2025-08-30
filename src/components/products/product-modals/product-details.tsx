import { useModal } from "@/stores/use-modal-store";
import { Badge, Button, GlobalModal, Icon, Label } from "@/components";
import { currentProductStore } from "@/stores";
import { formatPrice } from "@/utils";

export function SeeProduct() {
  const { closeModal } = useModal();
  const { currentProduct } = currentProductStore();

  return (
    <GlobalModal
      id="details-product"
      title="Detalhes do producto"
      description="Está a ver os detalhes do produto"
      className="!max-h-[85vh] !w-max"
      canClose
      footer={
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => closeModal("details-product")}
            variant={"outline"}
          >
            Fechar
          </Button>
        </div>
      }
    >
      <div className="space-y-4 w-[25rem]">
        <div className="flex items-center justify-center mx-auto rounded-full w-18 h-18 bg-primary/10">
          <Icon name="Package" className="w-16 h-16 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-center">{currentProduct?.name}</h2>
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">SKU: {currentProduct?.sku}</p>
          <Badge
            variant="secondary"
            className={
              !currentProduct
                ? "text-xs text-gray-700 bg-gray-100 border-gray-200" // estilo fallback
                : currentProduct.status === "Disponível"
                  ? "text-xs text-green-700 bg-green-100 border-green-200"
                  : currentProduct.status === "Pendente"
                    ? "text-xs text-yellow-700 bg-yellow-100 border-yellow-200"
                    : "text-xs text-red-700 bg-red-100 border-red-200"
            }
          >
            {currentProduct ? currentProduct.status : "Sem estado"}
          </Badge>

        </div>
        <div className="flex gap-2">
          <div className="p-2 border rounded-md text-md border-muted text-muted-foreground"><span>{currentProduct?.category}</span></div>
          <div className="p-2 border rounded-md text-md border-muted text-muted-foreground"><span>{currentProduct?.measurement}</span></div>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">Items em estoque: {currentProduct?.stock}</p>
          <p className="text-sm text-muted-foreground">Garantia: {currentProduct?.warranty} Dias</p>
        </div>
        <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">Endereço: {currentProduct?.location}</p>
        <p className="text-sm text-muted-foreground">Expira em: {currentProduct?.expirydate?.toLocaleDateString()}</p>
        </div>
        <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">Tempo de reposição: {currentProduct?.repositiontime} Dias</p>
        <p className="text-sm text-muted-foreground">Estoque minímo: {currentProduct?.minstock}</p>
        </div>
        <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">Fornecedor: {currentProduct?.supplier}</p>
        <p className="text-sm text-muted-foreground">Imposto: {currentProduct?.tax}%</p>
        </div>
        <p className="text-sm text-muted-foreground">Vendas por dia: {currentProduct?.salesperday}</p>
        <Label className="text-sm text-muted-foreground">Preço:</Label>
        <h2 className="text-3xl font-semibold text-center text-primary">{formatPrice(currentProduct?.price ?? 0)}</h2>
        <Label className="text-sm text-muted-foreground">Descrição:</Label>
        <p className="text-sm text-muted-foreground">{currentProduct?.description}</p> 
      </div>
    </GlobalModal>
  );
}
