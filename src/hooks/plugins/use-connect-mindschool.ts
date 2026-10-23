"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { pluginsService } from "@/services";
import {
  MINDSCHOOL_CALLBACK_PATH,
  openBlankPopup,
  runConnectFlow,
  type ConnectOutcome,
} from "@/lib/mindschool-connect";
import { ErrorMessage, SucessMessage, WarningMessage } from "@/utils/messages";
import { getApiErrorMessage } from "@/utils/api-error";
import { PLUGINS_STATUS_KEY } from "./use-plugins-status";

export type ConnectPhase = "idle" | "opening" | "waiting" | "completing";

const MESSAGES = {
  blocked:
    "O browser bloqueou a janela de ligação. Permita janelas pop-up para este site e volte a clicar em Conectar.",
  timeout:
    "A ligação demorou mais de 10 minutos e foi cancelada. Pode voltar a tentar.",
  cancelled: "A ligação foi cancelada. Nada foi alterado.",
} as const;

/**
 * Liga uma escola do MindSchool. `connect` tem de ser chamado directamente no
 * clique: a janela abre de forma síncrona e só depois se pede a URL.
 */
export function useConnectMindschool() {
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<ConnectPhase>("idle");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const cancel = useCallback(() => abortRef.current?.abort(), []);

  const connect = useCallback(
    async (storeId: string, knownConnectionIds: string[] = []) => {
      if (abortRef.current) return { status: "cancelled" } as ConnectOutcome;

      const popup = openBlankPopup(); // síncrono, antes de qualquer await
      const controller = new AbortController();
      abortRef.current = controller;
      setPhase("opening");

      const outcome = await runConnectFlow(popup, {
        requestAuthorization: () =>
          pluginsService.connect({
            storeId,
            redirectUri: `${window.location.origin}${MINDSCHOOL_CALLBACK_PATH}`,
          }),
        complete: (data) => pluginsService.complete(data),
        checkConnected: async () => {
          const list = await pluginsService.getStatus();
          return list.some(
            (c) => c.status === "ACTIVE" && !knownConnectionIds.includes(c.id),
          );
        },
        onPhase: setPhase,
        signal: controller.signal,
      });

      abortRef.current = null;
      setPhase("idle");
      await queryClient.invalidateQueries({ queryKey: PLUGINS_STATUS_KEY });

      switch (outcome.status) {
        case "success":
          SucessMessage(
            "Escola ligada. Falta definir o imposto de cada serviço para as facturas serem emitidas.",
          );
          break;
        case "blocked":
        case "timeout":
        case "cancelled":
          WarningMessage(MESSAGES[outcome.status]);
          break;
        case "denied":
          ErrorMessage(`A escola não autorizou a ligação: ${outcome.message}`);
          break;
        case "error":
          ErrorMessage(
            getApiErrorMessage(
              outcome.error,
              "Não foi possível concluir a ligação.",
            ),
          );
          break;
      }
      return outcome;
    },
    [queryClient],
  );

  return { connect, cancel, phase, isPending: phase !== "idle" };
}
