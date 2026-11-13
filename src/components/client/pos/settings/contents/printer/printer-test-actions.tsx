"use client";

import { useState } from "react";
import { Button, Icon } from "@/components";
import type { usePrinter } from "@/hooks/pos/use-printer";
import { isMindPrintError } from "@/services/mindprint-service";
import { usePrinterSettingsStore } from "@/stores/pos/printer-store";
import { ErrorMessage, SucessMessage } from "@/utils/messages";
import { PrinterSection } from "./printer-section";

type PrinterTestActionsProps = {
  printer: ReturnType<typeof usePrinter>;
};

function showPrintError(error: unknown) {
  ErrorMessage(
    isMindPrintError(error)
      ? error.message
      : "Não foi possível preparar o talão de exemplo.",
  );
}

export function PrinterTestActions({ printer }: PrinterTestActionsProps) {
  const { paperWidth } = usePrinterSettingsStore();
  const [isPrintingSample, setIsPrintingSample] = useState(false);

  const handleTestPrint = async () => {
    try {
      const result = await printer.testPrint();
      SucessMessage(`Talão de teste enviado para ${result.printer}.`);
    } catch (error) {
      showPrintError(error);
    }
  };

  const handleSamplePrint = async () => {
    setIsPrintingSample(true);
    try {
      const { buildInvoiceReceipt, SAMPLE_INVOICE_RECEIPT } = await import("@/utils/receipt");
      const bytes = buildInvoiceReceipt(SAMPLE_INVOICE_RECEIPT, { paperWidth });
      const result = await printer.print(bytes, `exemplo-${Date.now()}`);
      SucessMessage(`Factura de exemplo enviada para ${result.printer}.`);
    } catch (error) {
      showPrintError(error);
    } finally {
      setIsPrintingSample(false);
    }
  };

  return (
    <PrinterSection title="Testes">
      <p className="text-xs text-muted-foreground">
        &quot;Enviado&quot; quer dizer que o Windows ou a impressora aceitou o trabalho. Confirme
        no papel que os acentos (ç ã õ é ê º ª) e o código QR saem correctamente.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" onClick={handleTestPrint} disabled={printer.isTestPrinting}>
          <Icon name="Printer" size={14} />
          {printer.isTestPrinting ? "A imprimir…" : "Imprimir talão de teste"}
        </Button>
        <Button variant="outline" onClick={handleSamplePrint} disabled={isPrintingSample}>
          <Icon name="Receipt" size={14} />
          {isPrintingSample ? "A imprimir…" : "Imprimir factura de exemplo"}
        </Button>
      </div>
      <div className="flex justify-end border-t border-border/50 pt-4">
        <Button variant="ghost" size="sm" onClick={printer.unpair} className="text-destructive">
          <Icon name="Unlink" size={14} />
          Desligar deste browser
        </Button>
      </div>
    </PrinterSection>
  );
}
