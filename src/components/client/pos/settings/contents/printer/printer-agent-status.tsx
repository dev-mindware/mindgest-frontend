"use client";

import { Badge, Button, Icon } from "@/components";
import type { usePrinter } from "@/hooks/pos/use-printer";
import { PrinterSection } from "./printer-section";

type PrinterAgentStatusProps = {
  printer: ReturnType<typeof usePrinter>;
};

const STATUS_BADGE = {
  checking: { label: "A verificar…", variant: "outline" },
  unavailable: { label: "Não encontrado", variant: "destructive" },
  unpaired: { label: "Não emparelhado", variant: "pending" },
  ready: { label: "Emparelhado", variant: "success" },
} as const;

export function PrinterAgentStatus({ printer }: PrinterAgentStatusProps) {
  const badge = STATUS_BADGE[printer.status];

  return (
    <PrinterSection title="Agente MindPrint">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
            <Icon name="Printer" size={16} className="text-primary-500" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium">
              MindPrint{printer.version ? ` v${printer.version}` : ""}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Imprime os talões directamente na impressora térmica deste computador.
            </p>
          </div>
        </div>
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </div>

      {printer.status === "unavailable" && (
        <div className="rounded-xl bg-muted/40 border border-border/50 p-3 text-xs text-muted-foreground space-y-1.5">
          <p className="font-medium text-foreground">O MindPrint não respondeu neste computador.</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Instale o MindPrint e confirme que o ícone aparece junto ao relógio do Windows.</li>
            <li>
              Se o browser perguntar se o MindGest pode aceder a dispositivos na rede local,
              carregue em <strong>Permitir</strong>.
            </li>
            <li>Carregue em &quot;Verificar novamente&quot;.</li>
          </ol>
          <p>Até lá, os documentos continuam a ser impressos pelo browser.</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => printer.refresh()}
          disabled={printer.isRefreshing}
        >
          <Icon name="RefreshCw" size={14} />
          {printer.isRefreshing ? "A verificar…" : "Verificar novamente"}
        </Button>
      </div>
    </PrinterSection>
  );
}
