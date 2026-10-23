"use client";

import { useEffect, useState } from "react";
import { callbackChannelName } from "@/lib/mindschool-connect";
import type { MindschoolCallbackMessage } from "@/types";

type View = "working" | "done" | "invalid";

/**
 * Página pública (mesma origem do MindGest) para onde o MindSchool redirecciona.
 * Lê `code`/`state`, entrega-os ao separador de origem pelo BroadcastChannel e
 * fecha. Não chama a API nem guarda nada: quem conclui é o separador de origem.
 */
export default function MindschoolCallbackPage() {
  const [view, setView] = useState<View>("working");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const state = params.get("state");
    const code = params.get("code");
    const error = params.get("error");

    // tira o código de uso único do histórico e da barra de endereço
    window.history.replaceState(null, "", window.location.pathname);

    if (!state || (!code && !error)) {
      setView("invalid");
      return;
    }

    const message: MindschoolCallbackMessage = {
      type: "mindschool-callback",
      state,
      ...(error
        ? {
            error,
            errorDescription: params.get("error_description") ?? undefined,
          }
        : { code: code as string }),
    };

    const channel = new BroadcastChannel(callbackChannelName(state));
    channel.postMessage(message);
    // dá tempo à entrega antes de fechar
    const timer = setTimeout(() => {
      channel.close();
      setView("done");
      window.close();
    }, 300);

    return () => {
      clearTimeout(timer);
      channel.close();
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-6 text-center">
      <p className="max-w-sm text-sm text-muted-foreground">
        {view === "working" && "A concluir a ligação…"}
        {view === "done" &&
          "Pode fechar esta janela e voltar ao MindGest para ver o resultado."}
        {view === "invalid" &&
          "Este endereço não é válido. Volte ao MindGest e inicie a ligação em Definições › Plugins."}
      </p>
    </main>
  );
}
