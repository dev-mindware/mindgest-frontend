"use client";

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import type { usePrinter } from "@/hooks/pos/use-printer";
import { usePrinterSettingsStore } from "@/stores/pos/printer-store";
import type { PaperWidth } from "@/types";
import { PrinterSection } from "./printer-section";

type PrinterSelectionProps = {
  printer: ReturnType<typeof usePrinter>;
};

/** O Radix Select não aceita value vazio: representa "impressora por omissão do agente". */
const AGENT_DEFAULT = "__agent_default__";

const PAPER_OPTIONS: { value: PaperWidth; label: string }[] = [
  { value: "80mm", label: "80 mm (48 colunas)" },
  { value: "58mm", label: "58 mm (32 colunas)" },
];

export function PrinterSelection({ printer }: PrinterSelectionProps) {
  const { paperWidth, setPaperWidth } = usePrinterSettingsStore();
  const agentDefault = printer.printers.find((item) => item.default);

  return (
    <PrinterSection title="Impressora">
      <div className="space-y-2">
        <Label htmlFor="mindprint-printer">Impressora</Label>
        <Select
          value={printer.printerId ?? AGENT_DEFAULT}
          onValueChange={(value) =>
            printer.selectPrinter(value === AGENT_DEFAULT ? null : value)
          }
        >
          <SelectTrigger id="mindprint-printer" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AGENT_DEFAULT}>
              Impressora por omissão do agente
              {agentDefault ? ` (${agentDefault.name})` : ""}
            </SelectItem>
            {printer.printers.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name} {item.type === "tcp" ? "(rede)" : "(USB/Windows)"}
              </SelectItem>
            ))}
            {printer.selectedPrinterMissing && printer.printerId && (
              <SelectItem value={printer.printerId} disabled>
                {printer.printerId} (indisponível)
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {printer.selectedPrinterMissing && (
          <p className="text-xs text-destructive">
            A impressora escolhida já não existe no MindPrint. Escolha outra impressora.
          </p>
        )}
        {printer.printerListError && (
          <p className="text-xs text-destructive">{printer.printerListError.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mindprint-paper">Largura do papel</Label>
        <Select
          value={paperWidth}
          onValueChange={(value) => setPaperWidth(value as PaperWidth)}
        >
          <SelectTrigger id="mindprint-paper" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAPER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </PrinterSection>
  );
}
