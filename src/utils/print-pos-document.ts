import { downloadDocument } from "@/services";
import type { DocumentType, DownloadType } from "@/types";

export type PrintPosDocumentOptions = {
  id: string;
  type: DocumentType;
  thermal: boolean;
};

export function createDocumentUrl(data: BlobPart): string {
  const blob =
    data instanceof Blob
      ? data
      : new Blob([data], {
          type: "application/pdf",
        });

  return URL.createObjectURL(blob);
}

/**
 * Imprime um documento PDF de forma directa através de um iframe invisível no DOM,
 * acionando a impressora/diálogo nativo sem abrir novas abas ou janelas no navegador.
 *
 * @param url URL do Blob do PDF a imprimir.
 * @param documentTitle Nome/número do documento para que o navegador sugira o nome correto caso o utilizador use "Salvar como PDF".
 */
export function printDocumentDirectly(
  url: string,
  documentTitle?: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const frame = document.createElement("iframe");
    frame.setAttribute("aria-hidden", "true");
    frame.setAttribute("tabindex", "-1");
    if (documentTitle) {
      frame.setAttribute("title", documentTitle);
    }
    frame.style.position = "fixed";
    frame.style.top = "0";
    frame.style.left = "0";
    frame.style.width = "100%";
    frame.style.height = "100%";
    frame.style.border = "none";
    frame.style.opacity = "0";
    frame.style.pointerEvents = "none";
    frame.style.zIndex = "-9999";

    const originalTitle = typeof document !== "undefined" ? document.title : "";
    let isCleanedUp = false;
    const cleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;
      if (documentTitle && typeof document !== "undefined" && originalTitle) {
        document.title = originalTitle;
      }
      try {
        if (frame.parentNode) {
          frame.parentNode.removeChild(frame);
        }
      } catch {
        // Ignora erros caso o elemento já não esteja no DOM
      }
    };

    frame.onload = () => {
      // Delay essencial para permitir a inicialização completa do plugin de PDF no Chromium/Edge
      window.setTimeout(() => {
        try {
          const printWindow = frame.contentWindow;
          if (!printWindow) {
            cleanup();
            reject(
              new Error("Não foi possível aceder ao recurso de impressão da impressora."),
            );
            return;
          }

          // Se fornecido um título/número (ex: "FT FTSEDE26CMR/7"), aplica-o temporariamente
          // ao document.title para que a opção "Salvar como PDF" do navegador sugira o nome do documento.
          if (documentTitle && typeof document !== "undefined") {
            const cleanTitle = documentTitle.replace(/[/\\?%*:|"<>]/g, "_");
            document.title = cleanTitle;
            try {
              if (frame.contentDocument) {
                frame.contentDocument.title = cleanTitle;
              }
            } catch {
              // Ignora restrições de cross-origin caso existam
            }
          }

          printWindow.addEventListener(
            "afterprint",
            () => {
              cleanup();
              resolve();
            },
            { once: true },
          );

          printWindow.focus();
          printWindow.print();

          // Timeout de salvaguarda caso afterprint não seja disparado pelo navegador/sistema
          window.setTimeout(() => {
            cleanup();
            resolve();
          }, 30_000);
        } catch (error) {
          cleanup();
          reject(error);
        }
      }, 350);
    };

    frame.onerror = () => {
      cleanup();
      reject(new Error("Não foi possível carregar a factura para impressão directa."));
    };

    frame.src = url;
    document.body.appendChild(frame);
  });
}

export async function printPosDocument({
  id,
  type,
  thermal,
}: PrintPosDocumentOptions): Promise<void> {
  const format: DownloadType = thermal ? "thermal" : "pdf";
  const response = await downloadDocument(id, type, format);
  const url = createDocumentUrl(response.data);

  try {
    await printDocumentDirectly(url);
  } finally {
    // Revoga a URL do Blob após 60 segundos com segurança para garantir
    // que o spooler de impressão da impressora térmica termine o envio dos dados.
    window.setTimeout(() => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // Ignora
      }
    }, 60_000);
  }
}
