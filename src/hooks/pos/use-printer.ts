"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MINDPRINT_ENABLED,
  MINDPRINT_UNPAIRED_CODES,
} from "@/constants/mindprint";
import { createMindPrintClient, isMindPrintError } from "@/services/mindprint-service";
import { usePrinterSettingsStore } from "@/stores/pos/printer-store";
import type { PrinterAgentStatus } from "@/types";

const MINDPRINT_QUERY_KEY = "mindprint";
const HEALTH_STALE_TIME_MS = 15_000;

/**
 * Estado e acções do agente local MindPrint.
 *
 * O `health` é verificado ao montar e quando a janela volta a ter foco (sem
 * polling). Um token rejeitado pelo agente é esquecido automaticamente.
 */
export function usePrinter() {
  const queryClient = useQueryClient();
  const { token, port, printerId, setToken, setPrinterId } =
    usePrinterSettingsStore();

  const client = createMindPrintClient({ port, token });
  const enabled = MINDPRINT_ENABLED && typeof window !== "undefined";

  /** Token inválido/sem emparelhamento: esquece o token local. */
  const forgetTokenOnAuthError = (error: unknown) => {
    if (isMindPrintError(error) && MINDPRINT_UNPAIRED_CODES.includes(error.code)) {
      setToken(null);
    }
  };

  const healthQuery = useQuery({
    queryKey: [MINDPRINT_QUERY_KEY, "health", port],
    queryFn: client.health,
    enabled,
    retry: false,
    staleTime: HEALTH_STALE_TIME_MS,
    refetchOnWindowFocus: true,
  });

  const canListPrinters = enabled && !!token && healthQuery.isSuccess;

  const printersQuery = useQuery({
    queryKey: [MINDPRINT_QUERY_KEY, "printers", port, token],
    queryFn: async () => {
      try {
        return await client.printers();
      } catch (error) {
        forgetTokenOnAuthError(error);
        throw error;
      }
    },
    enabled: canListPrinters,
    retry: false,
    staleTime: HEALTH_STALE_TIME_MS,
    refetchOnWindowFocus: true,
  });

  const printerListError =
    printersQuery.error && isMindPrintError(printersQuery.error)
      ? printersQuery.error
      : null;

  const status: PrinterAgentStatus = !enabled || healthQuery.isPending
    ? "checking"
    : healthQuery.isError
      ? "unavailable"
      : !token
        ? "unpaired"
        : printersQuery.isPending
          ? "checking"
          : printerListError?.code === "AGENT_UNAVAILABLE"
            ? "unavailable"
            : "ready";

  const printers = printersQuery.data ?? [];
  const selectedPrinterMissing =
    !!printerId && printersQuery.isSuccess && !printers.some((p) => p.id === printerId);

  const pairMutation = useMutation({
    mutationFn: (code: string) => client.pair(code),
    onSuccess: ({ token: newToken }) => {
      setToken(newToken);
      queryClient.invalidateQueries({ queryKey: [MINDPRINT_QUERY_KEY] });
    },
  });

  const printMutation = useMutation({
    mutationFn: ({ data, jobId }: { data: Uint8Array; jobId: string }) =>
      client.print({ printer: printerId, data, jobId }),
    onError: forgetTokenOnAuthError,
  });

  const testPrintMutation = useMutation({
    mutationFn: () => client.testPrint(printerId),
    onError: forgetTokenOnAuthError,
  });

  const unpair = () => {
    setToken(null);
    setPrinterId(null);
    queryClient.removeQueries({ queryKey: [MINDPRINT_QUERY_KEY, "printers"] });
  };

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: [MINDPRINT_QUERY_KEY] });

  return {
    enabled: MINDPRINT_ENABLED,
    status,
    version: healthQuery.data?.version ?? null,
    printers,
    printerListError,
    printerId,
    selectedPrinterMissing,
    selectPrinter: setPrinterId,
    pair: pairMutation.mutateAsync,
    isPairing: pairMutation.isPending,
    unpair,
    print: (data: Uint8Array, jobId: string) => printMutation.mutateAsync({ data, jobId }),
    testPrint: testPrintMutation.mutateAsync,
    isTestPrinting: testPrintMutation.isPending,
    refresh,
    isRefreshing: healthQuery.isFetching || printersQuery.isFetching,
  };
}
