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

        await scanner.start(
          {
            facingMode: { exact: "environment" },
            advanced: [{ focusMode: "continuous" } as MediaTrackConstraintSet],
          },
          {
            fps: 15,
            qrbox: { width: 300, height: 120 },
          },
          onScan,
          () => {},
        );

        setIsScanning(true);
        setHasCameraPermission(true);
        setError(null);
      } catch (err: unknown) {
        setHasCameraPermission(false);
        scannerRef.current = null;

        const msg =
          err instanceof Error ? err.message.toLowerCase() : "";

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
