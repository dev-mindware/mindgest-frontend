"use client";

import { useModal } from "@/stores/modal/use-modal-store";
import { currentProformaStore } from "@/stores/documents";
import { DynamicDrawer } from "./index";
import { InvoiceTemplate } from "./templates/invoice-template";

import { Button, Icon } from "@/components";

export function ProformaPreviewDrawer() {
  const { open, closeModal, openModal } = useModal();
  const { currentProforma } = currentProformaStore();
  const isOpen = open["details-proforma"];

  if (!currentProforma) return null;

  return (
    <DynamicDrawer
      open={!!isOpen}
      onOpenChange={(val) => !val && closeModal("details-proforma")}
      title="Pré-visualização da Proforma"
      description={`Detalhes da proforma ${currentProforma.number}`}
    >
      <InvoiceTemplate type="proforma" data={currentProforma} />

      <div className="flex flex-wrap items-center justify-end gap-2 pt-4 mt-6 border-t">
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5"
          onClick={() => {
            closeModal("details-proforma");
            openModal("delete-proforma");
          }}
        >
          <Icon name="Trash2" size={14} />
          Apagar Proforma
        </Button>

        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => {
            closeModal("details-proforma");
            openModal("convert-proforma");
          }}
        >
          <Icon name="FileCheck" size={14} />
          Converter em Factura
        </Button>
      </div>
    </DynamicDrawer>
  );
}
