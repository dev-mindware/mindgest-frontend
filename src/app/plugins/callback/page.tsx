"use client";

import { useEffect, useRef, useState } from "react";
import { callbackChannelName, readCallbackMessage } from "@/lib/mindschool-connect";
import type { MindschoolCallbackMessage } from "@/types";

type View = "working" | "done" | "invalid";

/**
 * Página pública (mesma origem do MindGest) para onde o MindSchool redirecciona.
 * Lê `code`/`state`, entrega-os ao separador de origem pelo BroadcastChannel e
 * fecha. Não chama a API nem guarda nada: quem conclui é o separador de origem.
 *
 * O efeito tem de ser idempotente: em desenvolvimento o React corre-o duas vezes e a
 * barra de endereço já foi limpa na primeira (o código é de uso único), por isso o
 * URL lê-se uma só vez, a mensagem publica-se uma só vez e o fecho agenda-se em cada corrida.
 */
export default function MindschoolCallbackPage() {
  const [view, setView] = useState<View>("working");
  const message = useRef<MindschoolCallbackMessage | null | undefined>(undefined);
  const sent = useRef(false);

  useEffect(() => {
    if (message.current === undefined) {
      message.current = readCallbackMessage(window.location.search);
      // tira o código de uso único do histórico e da barra de endereço
      window.history.replaceState(null, "", window.location.pathname);
    }
    const current = message.current;
    if (!current) {
      setView("invalid");
      return;
    }

    const channel = new BroadcastChannel(callbackChannelName(current.state));
    if (!sent.current) {
      sent.current = true;
      channel.postMessage(current);
    }
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
