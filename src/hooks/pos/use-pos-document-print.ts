"use client";

import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  MINDPRINT_CLIENT_BUG_CODES,
  PAPER_MAX_IMAGE_WIDTH,
} from "@/constants/mindprint";
import { invoiceReceiptService } from "@/services/invoice-receipt-service";
import { isMindPrintError } from "@/services/mindprint-service";
import { usePrinterSettingsStore } from "@/stores/pos/printer-store";
import { useWorkspaceStore } from "@/stores/pos/workspace-store";
// Import directo (não pelo barrel "@/utils/receipt"): não puxa o encoder para o bundle.
import {
  assertPrintable,
  isReceiptDataError,
} from "@/utils/receipt/validate-print-data";
import type { DocumentType } from "@/types";
import { ErrorMessage, InfoMessage, SucessMessage } from "@/utils/messages";
import { printPosDocument } from "@/utils/print-pos-document";
import { usePrinter } from "./use-printer";

export type PosPrintDocument = { id: string; type: DocumentType };

/** Só a Factura Recibo tem talão ESC/POS; os outros documentos seguem pelo browser. */
const AGENT_DOCUMENT_TYPES: DocumentType[] = ["invoice-receipt"];

/**
 * Impressão do documento emitido no POS.
 *
 * Com o MindPrint ligado e pronto, monta o talão ESC/POS e envia-o ao agente.
 * Caso contrário (flag desligada, agente indisponível ou não emparelhado),
 * usa o fluxo actual pelo browser. Se o agente falhar, NÃO abre o diálogo do
 * browser sozinho: expõe `agentError` para a UI oferecer "Imprimir pelo browser".
 */
export function usePosDocumentPrint() {
  const queryClient = useQueryClient();
  const printer = usePrinter();
  const { paperWidth } = usePrinterSettingsStore();
  const { useThermalPrinter } = useWorkspaceStore();

  const [document, setDocument] = useState<PosPrintDocument | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);
  // Documentos já enviados ao agente nesta sessão: um novo envio é uma
  // reimpressão pedida pelo operador e leva um jobId novo.
  const sentDocuments = useRef(new Set<string>());

  const open = (doc: PosPrintDocument) => {
    setAgentError(null);
    setDocument(doc);
  };

  const close = () => {
    if (isPrinting) return;
    setAgentError(null);
    setDocument(null);
  };

  const printInBrowser = async () => {
    if (!document || isPrinting) return;
    setIsPrinting(true);
    try {
      await printPosDocument({ ...document, thermal: useThermalPrinter });
      setAgentError(null);
      setDocument(null);
    } catch (error) {
      console.error("Erro ao imprimir o documento:", error);
      ErrorMessage("Não foi possível imprimir o documento. Tente novamente.");
    } finally {
      setIsPrinting(false);
    }
  };

  const printWithAgent = async (doc: PosPrintDocument) => {
    setIsPrinting(true);
    setAgentError(null);
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ["invoice-receipt-print-data", doc.id],
        queryFn: () => invoiceReceiptService.getPrintData(doc.id),
        // O hash/assinatura pode ser gravado pouco depois da emissão: não reutilizar.
        staleTime: 0,
      });
      assertPrintable(data);

      // Carregado só quando se imprime: mantém o encoder fora do bundle inicial do POS.
      const { buildInvoiceReceipt, loadReceiptLogo } = await import("@/utils/receipt");
      const logo = await loadReceiptLogo(
        data.company.logoUrl,
        PAPER_MAX_IMAGE_WIDTH[paperWidth],
      );
      const bytes = buildInvoiceReceipt(data, { paperWidth, logo });

      const jobId = sentDocuments.current.has(doc.id)
        ? `${doc.id}-r${Date.now()}`
        : doc.id;
      sentDocuments.current.add(doc.id);

      const result = await printer.print(bytes, jobId);
      SucessMessage(
        result.duplicate
          ? "Este talão já tinha sido enviado à impressora."
          : "Talão enviado para a impressora.",
      );
      setDocument(null);
    } catch (error) {
      if (isMindPrintError(error)) {
        if (error.code === "JOB_IN_PROGRESS") {
          InfoMessage("Este talão já está a imprimir.");
          setDocument(null);
          return;
        }
        if (MINDPRINT_CLIENT_BUG_CODES.includes(error.code)) {
          console.error("MindPrint rejeitou o talão:", error.code, error.message);
        }
        setAgentError(error.message);
        return;
      }

      if (isReceiptDataError(error)) {
        setAgentError(`${error.message} Pode imprimir pelo browser.`);
        return;
      }

      console.error("Erro ao preparar o talão:", error);
      setAgentError(
        "Não foi possível preparar o talão para a impressora. Pode imprimir pelo browser.",
      );
    } finally {
      setIsPrinting(false);
    }
  };

  const print = async () => {
    if (!document || isPrinting) return;

    const canUseAgent =
      printer.enabled &&
      printer.status === "ready" &&
      AGENT_DOCUMENT_TYPES.includes(document.type);

    if (canUseAgent) {
      await printWithAgent(document);
      return;
    }

    await printInBrowser();
  };

  return {
    document,
    isPrinting,
    agentError,
    open,
    close,
    print,
    printInBrowser,
  };
}
