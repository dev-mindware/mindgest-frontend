"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Textarea,
  Label,
  Separator,
  Badge,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { agtService } from "@/services";
import { toast } from "sonner";
import { Icon } from "@/components";
import { ShieldCheck, ShieldAlert, Key, Info } from "lucide-react";

export function Agt() {
  const [privateKey, setPrivateKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingStatus, setIsFetchingStatus] = useState(true);
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

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
      toast.success("Chave privada da AGT atualizada com sucesso!");
      setPrivateKey("");
      fetchStatus();
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao atualizar a chave.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl text-center md:text-start font-semibold">Configuração AGT</h2>
          <p className="text-center text-muted-foreground md:text-start">
            Gerencie as credenciais de assinatura digital da sua empresa.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          {isFetchingStatus ? (
            <Badge variant="outline" className="animate-pulse">Verificando...</Badge>
          ) : hasKey ? (
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 flex gap-1.5 items-center px-3 py-1">
              <ShieldCheck size={14} />
              Configurado
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex gap-1.5 items-center px-3 py-1">
              <ShieldAlert size={14} />
              Não Configurado
            </Badge>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid gap-6">
        <Alert variant="default" className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary font-semibold">Segurança em primeiro lugar</AlertTitle>
          <AlertDescription className="text-sm opacity-90">
            A chave privada é utilizada exclusivamente para assinar digitalmente os documentos enviados à AGT. 
            Uma vez guardada, ela não poderá ser visualizada novamente por ninguém, nem mesmo pelo proprietário.
          </AlertDescription>
        </Alert>

        <Card className="border-muted shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg">Chave Privada do Contribuinte</CardTitle>
            </div>
            <CardDescription>
              Insira a chave privada (formato PEM) gerada para o NIF da sua empresa.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="private-key" className="text-sm font-medium">Conteúdo da Chave</Label>
              <Textarea
                id="private-key"
                placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
                className="min-h-[250px] font-mono text-xs resize-none bg-muted/30 focus-visible:ring-primary/30"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Certifique-se de incluir os cabeçalhos e rodapés completo.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button 
                onClick={handleUpdateKey} 
                disabled={isLoading || !privateKey.trim()}
                className="min-w-[140px]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </div>
                ) : (
                  "Guardar Alterações"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
