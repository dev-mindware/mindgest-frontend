"use client";

import { useEffect, useState } from "react";
import { Button, Icon } from "@/components";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Label,
  Separator,
  Textarea,
} from "@/components/ui";
import { agtService } from "@/services";
import { getApiErrorMessage } from "@/utils";
import { toast } from "sonner";

export function AgtKeySettings() {
  const [privateKey, setPrivateKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingStatus, setIsFetchingStatus] = useState(true);
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  const fetchStatus = async () => {
    try {
      const data = await agtService.getStatus();
      setHasKey(data.hasKey);
    } catch (error) {
      console.error("Failed to fetch AGT status:", error);
    } finally {
      setIsFetchingStatus(false);
    }
  };

  useEffect(() => {
    void fetchStatus();
  }, []);

  const validateKey = (key: string) => {
    const trimmed = key.trim();
    if (!trimmed.includes("-----BEGIN PRIVATE KEY-----")) {
      return "A chave deve começar com -----BEGIN PRIVATE KEY-----";
    }
    if (!trimmed.includes("-----END PRIVATE KEY-----")) {
      return "A chave deve terminar com -----END PRIVATE KEY-----";
    }
    if (trimmed.length < 100) {
      return "A chave parece ser demasiado curta.";
    }
    return null;
  };

  const handleUpdateKey = async () => {
    const error = validateKey(privateKey);
    if (error) {
      toast.error(error);
      return;
    }

    setIsLoading(true);
    try {
      await agtService.updatePrivateKey(privateKey);
      toast.success("Chave privada da AGT actualizada com sucesso.");
      setPrivateKey("");
      void fetchStatus();
    } catch (requestError) {
      toast.error(
        getApiErrorMessage(requestError, "Não foi possível actualizar a chave."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Chave privada</h3>
          <p className="text-sm text-muted-foreground">
            Configure a chave PEM usada na assinatura digital da empresa.
          </p>
        </div>

        {isFetchingStatus ? (
          <Badge variant="outline">A verificar...</Badge>
        ) : hasKey ? (
          <Badge variant="secondary" className="gap-1.5">
            <Icon name="ShieldCheck" className="h-3.5 w-3.5" />
            Configurada
          </Badge>
        ) : (
          <Badge variant="destructive" className="gap-1.5">
            <Icon name="ShieldAlert" className="h-3.5 w-3.5" />
            Não configurada
          </Badge>
        )}
      </div>

      <Alert>
        <Icon name="Info" />
        <AlertTitle>Segurança</AlertTitle>
        <AlertDescription>
          A chave privada é encriptada no servidor antes de ser armazenada. Por segurança, não é possível recuperá-la depois do envio.
        </AlertDescription>
      </Alert>

      <div className="rounded-md border bg-background p-4">
        <div className="space-y-2">
          <Label htmlFor="private-key">Conteúdo da chave</Label>
          <Textarea
            id="private-key"
            placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
            className="min-h-52 resize-none font-mono text-xs"
            value={privateKey}
            onChange={(event) => setPrivateKey(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Cole o conteúdo completo do ficheiro PEM para substituir a chave actualmente configurada.
          </p>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleUpdateKey}
            disabled={isLoading || !privateKey.trim()}
          >
            {isLoading ? "A processar..." : "Actualizar chave"}
          </Button>
        </div>
      </div>
    </div>
  );
}
