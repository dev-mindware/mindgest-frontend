import { useModal } from "@/stores/use-modal-store";
import { InvoiceResponse } from "@/types";
import { currentInvoiceStore } from "@/stores/documents";
import { currentProformaStore } from "@/stores/documents";

export function useInvoiceActions() {
  const { openModal } = useModal();
  const { setCurrentInvoice } = currentInvoiceStore();

  function handlerGenerateReceipt(invoice: InvoiceResponse) {
    openModal("generate-receipt");
    setCurrentInvoice(invoice);
  }

  function handlerCancelInvoice(invoice: InvoiceResponse) {
    openModal("cancel-invoice");
    setCurrentInvoice(invoice);
  }

  function handlerDetailsInvoice(invoice: InvoiceResponse) {
    openModal("details-invoice");
    setCurrentInvoice(invoice);
  }

  return {
    handlerGenerateReceipt,
    handlerCancelInvoice,
    handlerDetailsInvoice,
  };
}

export function useProformaActions() {
  const { openModal } = useModal();
  const { setCurrentProforma } = currentProformaStore();

  function handlerDeleteProforma(proforma: InvoiceResponse) {
    openModal("delete-proforma");
    setCurrentProforma(proforma);
  }

  function handlerDetailsProforma(proforma: InvoiceResponse) {
    openModal("details-proforma");
    setCurrentProforma(proforma);
  }

  function hanlderEditProforma(proforma: InvoiceResponse) {
    // levar ora o formulario da proforma com o id e com os dados já pre renderizados
  }

  return {
    handlerDeleteProforma,
    handlerDetailsProforma,
    hanlderEditProforma,
  };
}
