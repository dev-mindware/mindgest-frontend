"use client";

import { useModal } from "@/stores/use-modal-store";
import { currentInvoiceStore } from "@/stores/documents";
import { DynamicDrawer } from "./index";
import { InvoiceTemplate } from "./templates/invoice-template";

export function InvoicePreviewDrawer() {
  const { open, closeModal } = useModal();
  const { currentInvoice } = currentInvoiceStore();
  const isOpen = open["details-invoice"];

  if (!currentInvoice) return null;

  return (
    <DynamicDrawer
      open={!!isOpen}
      onOpenChange={(val) => !val && closeModal("details-invoice")}
      title="Pré-visualização da Fatura"
      description={`Detalhes da fatura ${currentInvoice.number}`}
    >
      <InvoiceTemplate data={currentInvoice} />
    </DynamicDrawer>
  );
}
