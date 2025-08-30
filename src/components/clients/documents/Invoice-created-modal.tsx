import { GlobalModal } from "@/components/modal";
import { Button } from "@/components/ui";
import { useModal } from "@/stores";

type TypeInvoice = "invoice-tab" | "receipt-tab" | "proform-tab";

export function InvoiceCreatedModal({ type }: { type: TypeInvoice }) {
  const { closeModal } = useModal();

  const dinamicTitle =
    type === "invoice-tab"
      ? "Fatura criada e baixada"
      : type === "proform-tab"
      ? "Proforma criada e baixada"
      : "Recibo criado e baixado";
  const dinamicDescription =
    type === "invoice-tab"
      ? "A sua fatura foi criada e baixada com sucesso."
      : type === "proform-tab"
      ? "A sua fatura proforma foi criada e baixada com sucesso."
      : "O seu recibo foi criado e baixado com sucesso.";

  return (
    <GlobalModal
      sucess
      id="invoice-created"
      title={dinamicTitle}
      description={dinamicDescription}
      className="w-[28rem]"
    >
      <div className="w-full mt-4">
        <Button
          className="w-full"
          onClick={() => closeModal("invoice-created")}
        >
          Fechar
        </Button>
      </div>
    </GlobalModal>
  );
}
