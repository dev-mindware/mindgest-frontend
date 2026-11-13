"use client";

import { usePrinter } from "@/hooks/pos/use-printer";
import { PrinterAgentStatus } from "./printer-agent-status";
import { PrinterPairForm } from "./printer-pair-form";
import { PrinterSelection } from "./printer-selection";
import { PrinterTestActions } from "./printer-test-actions";

export function PosPrinterSettings() {
  const printer = usePrinter();

  return (
    <div className="space-y-6 pb-12" data-tour="pos-settings-printer-agent">
      <PrinterAgentStatus printer={printer} />

      {printer.status === "unpaired" && <PrinterPairForm printer={printer} />}

      {printer.status === "ready" && (
        <>
          <PrinterSelection printer={printer} />
          <PrinterTestActions printer={printer} />
        </>
      )}

      <p className="px-1 text-[11px] text-muted-foreground leading-relaxed italic">
        O emparelhamento e a impressora escolhida ficam guardados apenas neste browser.
      </p>
    </div>
  );
}
