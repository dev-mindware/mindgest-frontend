import type { MindschoolCallbackMessage } from "@/types";

export const MINDSCHOOL_CALLBACK_PATH = "/plugins/callback";
export const CONNECT_TIMEOUT_MS = 10 * 60 * 1000;
export const POLL_INTERVAL_MS = 3000;
const CLOSED_GRACE_MS = 1500;
const POPUP_NAME = "mindgest-mindschool-connect";
const POPUP_FEATURES = "popup=yes,width=520,height=720";

export function callbackChannelName(state: string) {
  return `mindgest-plugin-callback:${state}`;
}

/**
 * Lê `code`/`state`/`error` do redirect do MindSchool. `null` se faltar o `state` ou nem `code` nem `error`.
 * É pura: a página guarda o resultado, porque a barra de endereço é limpa logo a seguir (o código é de uso único).
 */
export function readCallbackMessage(search: string): MindschoolCallbackMessage | null {
  const params = new URLSearchParams(search);
  const state = params.get("state");
  const code = params.get("code");
  const error = params.get("error");
  if (!state || (!code && !error)) return null;
  return {
    type: "mindschool-callback",
    state,
    ...(error
      ? { error, errorDescription: params.get("error_description") ?? undefined }
      : { code: code as string }),
  };
}

export type ConnectOutcome =
  | { status: "success" }
  | { status: "blocked" }
  | { status: "timeout" }
  | { status: "cancelled" }
  | { status: "denied"; message: string }
  | { status: "error"; error: unknown };

export interface ConnectFlowDeps {
  /** Pede ao MindGest a URL de autorização (guarda o PKCE no servidor). */
  requestAuthorization: () => Promise<{ authorizeUrl: string; state: string }>;
  complete: (data: { code: string; state: string }) => Promise<unknown>;
  /** Alternativa ao canal: devolve true quando a ligação já está activa. */
  checkConnected: () => Promise<boolean>;
  onPhase?: (phase: "waiting" | "completing") => void;
  signal?: AbortSignal;
  timeoutMs?: number;
  pollIntervalMs?: number;
}

/**
 * Abre a janela em branco. Tem de ser chamado de forma síncrona no clique para
 * não ser travado pelo bloqueador de popups. `noopener` na feature devolveria
 * `null`, por isso corta-se a ligação ao separador de origem a seguir.
 */
export function openBlankPopup(): Window | null {
  const popup = window.open("about:blank", POPUP_NAME, POPUP_FEATURES);
  if (!popup) return null;
  try {
    popup.opener = null;
  } catch {
    // sem efeito: o resultado não depende de window.opener
  }
  return popup;
}

/**
 * Corre o fluxo depois de a janela estar aberta. O resultado chega pelo
 * BroadcastChannel (nome derivado do `state`); o *polling* do estado cobre a
 * perda da mensagem. O `code_verifier` nunca passa pelo browser.
 */
export async function runConnectFlow(
  popup: Window | null,
  deps: ConnectFlowDeps,
): Promise<ConnectOutcome> {
  if (!popup) return { status: "blocked" };

  let channel: BroadcastChannel | null = null;
  let pollTimer: ReturnType<typeof setInterval> | undefined;
  let closedTimer: ReturnType<typeof setInterval> | undefined;
  let timeoutTimer: ReturnType<typeof setTimeout> | undefined;
  let polling = false;

  const cleanup = () => {
    channel?.close();
    clearInterval(pollTimer);
    clearInterval(closedTimer);
    clearTimeout(timeoutTimer);
    try {
      if (!popup.closed) popup.close();
    } catch {
      // ignorar
    }
  };

  try {
    let auth: { authorizeUrl: string; state: string };
    try {
      auth = await deps.requestAuthorization();
    } catch (error) {
      try {
        popup.close();
      } catch {
        // ignorar
      }
      return { status: "error", error };
    }

    if (deps.signal?.aborted) {
      cleanup();
      return { status: "cancelled" };
    }

    const { state } = auth;
    const result = await new Promise<ConnectOutcome>((resolve) => {
      let settled = false;
      let completing = false;
      const settle = (outcome: ConnectOutcome) => {
        if (settled) return;
        settled = true;
        resolve(outcome);
      };

      channel = new BroadcastChannel(callbackChannelName(state));
      channel.onmessage = async (event: MessageEvent<unknown>) => {
        const msg = event.data as Partial<MindschoolCallbackMessage> | null;
        if (
          !msg ||
          msg.type !== "mindschool-callback" ||
          msg.state !== state
        ) {
          return; // state errado: ignorado
        }
        if (msg.error) {
          settle({
            status: "denied",
            message: msg.errorDescription || msg.error,
          });
          return;
        }
        if (!msg.code) return;
        completing = true;
        deps.onPhase?.("completing");
        try {
          await deps.complete({ code: msg.code, state });
          settle({ status: "success" });
        } catch (error) {
          settle({ status: "error", error });
        }
      };

      deps.onPhase?.("waiting");
      try {
        popup.location.href = auth.authorizeUrl;
      } catch (error) {
        settle({ status: "error", error });
        return;
      }

      pollTimer = setInterval(async () => {
        if (polling || settled) return;
        polling = true;
        try {
          if (await deps.checkConnected()) settle({ status: "success" });
        } catch {
          // o polling é só uma rede de segurança
        } finally {
          polling = false;
        }
      }, deps.pollIntervalMs ?? POLL_INTERVAL_MS);

      let closedSince: number | null = null;
      closedTimer = setInterval(() => {
        let closed = false;
        try {
          closed = popup.closed;
        } catch {
          closed = false;
        }
        if (!closed || completing) return;
        closedSince ??= Date.now();
        // dá tempo à mensagem do callback chegar antes de dar como cancelado
        if (Date.now() - closedSince >= CLOSED_GRACE_MS) {
          settle({ status: "cancelled" });
        }
      }, 500);

      timeoutTimer = setTimeout(
        () => settle({ status: "timeout" }),
        deps.timeoutMs ?? CONNECT_TIMEOUT_MS,
      );

      deps.signal?.addEventListener("abort", () =>
        settle({ status: "cancelled" }),
      );
    });
    return result;
  } finally {
    cleanup();
  }
}
