"use client";

import { useRef, useState, useCallback } from "react";
import type { Html5Qrcode as Html5QrcodeType } from "html5-qrcode";

type UseCameraScannerResult = {
  hasCameraPermission: boolean | null;
  error: string | null;
  isScanning: boolean;
  start: (onScan: (code: string) => void) => Promise<void>;
  stop: () => Promise<void>;
};

const SCANNER_CONFIG = {
  fps: 15,
  qrbox: { width: 300, height: 120 },
};

export function useCameraScanner(elementId: string): UseCameraScannerResult {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeType | null>(null);

  const stop = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    try {
      if (scanner.isScanning) await scanner.stop();
      scanner.clear();
    } catch {}
    scannerRef.current = null;
    setIsScanning(false);
  }, []);

  const start = useCallback(
    async (onScan: (code: string) => void) => {
      await stop();

      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const scanner = new Html5Qrcode(elementId);
        scannerRef.current = scanner;

        await startWithFallback(scanner, onScan);

        setIsScanning(true);
        setHasCameraPermission(true);
        setError(null);
      } catch (err: unknown) {
        setHasCameraPermission(false);
        scannerRef.current = null;

        const msg = err instanceof Error ? err.message.toLowerCase() : "";

        if (msg.includes("permission") || msg.includes("notallowed")) {
          setError("Acesso à câmara negado. Active as permissões nas definições do navegador.");
        } else if (msg.includes("notfound")) {
          setError("Nenhuma câmara detectada neste dispositivo.");
        } else {
          setError("Não foi possível iniciar a câmara. Tente novamente.");
        }
      }
    },
    [elementId, stop],
  );

  return { hasCameraPermission, error, isScanning, start, stop };
}

async function startWithFallback(
  scanner: Html5QrcodeType,
  onScan: (code: string) => void,
): Promise<void> {
  const noop = () => {};

  // 1ª tentativa: preferência pela câmara traseira sem constraint rígida
  // (compatível com iOS Safari — "ideal" nunca lança OverconstrainedError)
  try {
    await scanner.start(
      { facingMode: { ideal: "environment" } },
      SCANNER_CONFIG,
      onScan,
      noop,
    );
    return;
  } catch {}

  // 2ª tentativa: enumerar câmaras e seleccionar a traseira pelo label
  try {
    const { Html5Qrcode } = await import("html5-qrcode");
    const cameras = await Html5Qrcode.getCameras();
    const backCamera = cameras.find((c) =>
      /back|rear|environment|traseira/i.test(c.label),
    );
    const cameraId = backCamera?.id ?? cameras[cameras.length - 1]?.id;

    if (cameraId) {
      await scanner.start(cameraId, SCANNER_CONFIG, onScan, noop);
      return;
    }
  } catch {}

  // 3ª tentativa: deixar o browser escolher qualquer câmara disponível
  await scanner.start({ facingMode: "environment" }, SCANNER_CONFIG, onScan, noop);
}
