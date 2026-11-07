"use client";
import { Button, GlobalModal } from "@/components";
import { useModal } from "@/stores/modal/use-modal-store";
import type { DocumentTabType } from "@/stores/documents/document-draft-store";

export const MODAL_TRANSFER_DRAFT_ID = "transfer-draft";

export const DOCUMENT_TAB_LABELS: Record<DocumentTabType, string> = {
  invoice: "Factura",
  "invoice-receipt": "Factura Recibo",
  proforma: "Proforma",
};

interface TransferDraftModalProps {
  fromTab: DocumentTabType;
  toTab: DocumentTabType | null;
  /** Resumo do que está preenchido na aba de origem. */
  summary: { clientName?: string; itemsCount: number };
  onConfirm: () => void;
  onSkip: () => void;
}

export function TransferDraftModal({
  fromTab,
  toTab,
  summary,
  onConfirm,
  onSkip,
}: TransferDraftModalProps) {
  const { open, closeModal } = useModal();
  if (!open[MODAL_TRANSFER_DRAFT_ID] || !toTab) return null;

  const close = () => closeModal(MODAL_TRANSFER_DRAFT_ID);

  return (
    <GlobalModal
      canClose
      id={MODAL_TRANSFER_DRAFT_ID}
      title="Carregar selecções da aba anterior?"
      description={`Está a mudar de ${DOCUMENT_TAB_LABELS[fromTab]} para ${DOCUMENT_TAB_LABELS[toTab]}. Deseja carregar os dados já preenchidos (cliente, itens, descontos e observações) para a nova aba?`}
      className="!w-max"
    >
      <div className="space-y-4 sm:w-[26rem]">
        <div className="rounded-lg border bg-muted/50 p-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cliente:</span>
            <span className="font-medium">
              {summary.clientName || "Não seleccionado"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Itens adicionados:</span>
            <span className="font-medium">{summary.itemsCount}</span>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={close}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              close();
              onSkip();
            }}
          >
            Não carregar
          </Button>
          <Button
            type="button"
            onClick={() => {
              close();
              onConfirm();
            }}
          >
            Sim, carregar dados
          </Button>
        </div>
      </div>
    </GlobalModal>
  );
}

