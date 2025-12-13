"use client";
import { toast } from "sonner";
import { useModal, currentInvoiceStore } from "@/stores";
import { Button, GlobalModal } from "@/components";
import { useCancelInvoice } from "@/hooks";

export function CancelInvoiceModal() {
  const { closeModal, open } = useModal();
  const isOpen = open["cancel-invoice"];
  const { currentInvoice } = currentInvoiceStore();
  const { mutateAsync: cancelInvoice } = useCancelInvoice();

  async function handleCancelInvoice() {
    if (!currentInvoice?.id) {
      toast.error("Fatura não selecionada");
      return;
    }

    try {
      await cancelInvoice(currentInvoice.id);
      handleClose();
    } catch (error: any) {
      if (error?.response) {
        toast.error(
          error?.response?.data?.message || "Erro ao cancelar fatura"
        );
      } else {
        toast.error("Ocorreu um erro desconhecido");
      }
    }
  }

  const handleClose = () => {
    closeModal("cancel-invoice");
  };

  if (!isOpen) return null;

  return (
    <GlobalModal
      canClose
      id="cancel-invoice"
      title="Cancelar Fatura"
      className="!max-h-[85vh] !w-max"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja cancelar a fatura{" "}
            <strong>#{currentInvoice?.number}</strong>?
          </p>

          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cliente:</span>
                <span className="font-medium">{currentInvoice?.clientId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor:</span>
                <span className="font-medium">
                  {parseFloat(currentInvoice?.total || "0").toFixed(2)} AOA
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-5">
          <Button type="button" variant="outline" onClick={handleClose}>
            Voltar
          </Button>
          <Button
            className="w-max bg-destructive hover:bg-destructive/90"
            onClick={handleCancelInvoice}
          >
            Cancelar Fatura
          </Button>
        </div>
      </div>
    </GlobalModal>
  );
}
