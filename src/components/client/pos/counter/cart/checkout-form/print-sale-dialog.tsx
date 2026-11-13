"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, Icon } from "@/components";
import type { usePosDocumentPrint } from "@/hooks/pos/use-pos-document-print";

type PrintSaleDialogProps = {
  print: ReturnType<typeof usePosDocumentPrint>;
};

export function PrintSaleDialog({ print }: PrintSaleDialogProps) {
  const { document, isPrinting, agentError } = print;
  const documentLabel = document?.type === "proforma" ? "proforma" : "factura-recibo";

  return (
    <AlertDialog
      open={!!document}
      onOpenChange={(open) => {
        if (!open) print.close();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon name="Printer" size={20} />
          </div>
          <AlertDialogTitle>
            {agentError ? "Não foi possível imprimir" : "Deseja imprimir o documento?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {agentError ??
              `A ${documentLabel} foi emitida com sucesso. Pode imprimi-la agora ou continuar sem imprimir.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={print.close} disabled={isPrinting}>
            Agora não
          </Button>
          {agentError && (
            <Button
              variant="outline"
              onClick={print.printInBrowser}
              disabled={isPrinting}
              className="gap-2"
            >
              <Icon name="Globe" size={16} />
              Imprimir pelo browser
            </Button>
          )}
          <Button onClick={print.print} disabled={isPrinting} className="gap-2">
            <Icon name="Printer" size={16} />
            {isPrinting ? "A imprimir…" : agentError ? "Tentar novamente" : "Imprimir"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
