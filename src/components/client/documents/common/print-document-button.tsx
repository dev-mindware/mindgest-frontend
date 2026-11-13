"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Icon } from "@/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { downloadDocument } from "@/services";
import { invoiceReceiptService } from "@/services/invoice-receipt-service";
import { isMindPrintError } from "@/services/mindprint-service";
import { usePrinter } from "@/hooks/pos/use-printer";
import { usePrinterSettingsStore } from "@/stores/pos/printer-store";
import {
  createDocumentUrl,
  printDocumentDirectly,
} from "@/utils/print-pos-document";
import { assertPrintable } from "@/utils/receipt/validate-print-data";
import {
  MINDPRINT_CLIENT_BUG_CODES,
  PAPER_MAX_IMAGE_WIDTH,
} from "@/constants/mindprint";
import type { DocumentType } from "@/types/documents";
import type { DownloadType } from "@/types";
import { ErrorMessage, InfoMessage, SucessMessage } from "@/utils/messages";

type Props = {
  id: string;
  documentType: DocumentType;
  filenameBase?: string;
};

export function PrintDocumentButton({ id, documentType, filenameBase }: Props) {
  const [isPrinting, setIsPrinting] = useState(false);
  const queryClient = useQueryClient();
  const printer = usePrinter();
  const { paperWidth } = usePrinterSettingsStore();

  /**
   * Fallback secundário: imprime o PDF gerado pelo backend através de um iframe
   * invisível acionando o diálogo nativo do navegador (window.print()).
   */
  async function printInBrowser(format: DownloadType) {
    const response = await downloadDocument(id, documentType, format);
    const url = createDocumentUrl(response.data);
    try {
      await printDocumentDirectly(url, filenameBase);
    } finally {
      window.setTimeout(() => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // Ignora
        }
      }, 60_000);
    }
  }

  /**
   * Primário para talão: tenta imprimir directamente na impressora térmica
   * via agente local MindPrint (ESC/POS sem diálogo do navegador).
   */
  async function printWithAgent(): Promise<boolean> {
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ["invoice-receipt-print-data", id],
        queryFn: () => invoiceReceiptService.getPrintData(id),
        staleTime: 0,
      });

      assertPrintable(data);

      const { buildInvoiceReceipt, loadReceiptLogo } = await import(
        "@/utils/receipt"
      );

      const logo = await loadReceiptLogo(
        data.company.logoUrl,
        PAPER_MAX_IMAGE_WIDTH[paperWidth],
      );

      const bytes = buildInvoiceReceipt(data, { paperWidth, logo });
      const jobId = `${id}-doc-${Date.now()}`;

      const result = await printer.print(bytes, jobId);

      SucessMessage(
        result.duplicate
          ? "Este talão já tinha sido enviado à impressora."
          : "Talão impresso directamente pela impressora térmica.",
      );
      return true;
    } catch (error) {
      if (isMindPrintError(error)) {
        if (error.code === "JOB_IN_PROGRESS") {
          InfoMessage("Este talão já se encontra em impressão.");
          return true;
        }
        if (MINDPRINT_CLIENT_BUG_CODES.includes(error.code)) {
          console.error("MindPrint rejeitou o talão:", error.code, error.message);
        }
      }
      console.warn("Falha no agente MindPrint. A activar fallback pelo browser...", error);
      return false;
    }
  }

  async function handlePrint(format: DownloadType) {
    if (isPrinting) return;
    setIsPrinting(true);

    try {
      // 1. Primário: Se for talão de Factura-Recibo e o MindPrint estiver pronto
      const canUseAgent =
        format === "thermal" &&
        documentType === "invoice-receipt" &&
        printer.enabled &&
        printer.status === "ready";

      if (canUseAgent) {
        const printedDirectly = await printWithAgent();
        if (printedDirectly) {
          return;
        }
        // Se falhou no agente, avisa e segue para o fallback pelo browser
        InfoMessage("Agente local não concluiu a impressão. A abrir o gestor de impressão do browser...");
      }

      // 2. Fallback / A4: Imprime pelo browser nativo (window.print via iframe)
      await printInBrowser(format);
    } catch (error) {
      console.error("Erro geral ao imprimir documento:", error);
      ErrorMessage("Não foi possível imprimir o documento. Tente novamente.");
    } finally {
      setIsPrinting(false);
    }
  }

  const showThermalOption =
    documentType === "invoice-receipt" || documentType === "proforma";

  if (!showThermalOption) {
    return (
      <Button
        variant="outline"
        onClick={() => handlePrint("pdf")}
        disabled={isPrinting}
        className="gap-2"
      >
        <Icon name="Printer" size={16} />
        {isPrinting ? "A preparar..." : "Imprimir"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isPrinting} className="gap-2">
          <Icon name="Printer" size={16} />
          {isPrinting ? "A preparar..." : "Imprimir"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handlePrint("pdf")}>
          <Icon name="FileText" size={14} className="mr-2" />
          Formato A4 (Browser)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handlePrint("thermal")}>
          <Icon name="Printer" size={14} className="mr-2" />
          Talão {printer.enabled && printer.status === "ready" ? "(Directo Térmica)" : "(Browser)"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
