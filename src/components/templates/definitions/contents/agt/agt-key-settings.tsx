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
  Badge,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { agtService } from "@/services";
import { toast } from "sonner";
import { ShieldCheck, ShieldAlert, Key, Info } from "lucide-react";

export function AgtKeySettings() {
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-medium">Configurações de Chave</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie a chave privada de assinatura digital para a sua empresa.
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

      <div className="grid gap-6">
        <Alert variant="default" className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary font-semibold text-sm">Segurança de Dados</AlertTitle>
          <AlertDescription className="text-xs opacity-90">
            A chave privada é encriptada no servidor antes de ser armazenada. Por motivos de segurança, ela não pode ser recuperada após o envio.
          </AlertDescription>
        </Alert>

        <Card className="border-muted shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-base">Nova Chave PEM</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Cole o conteúdo do seu ficheiro .pem abaixo para atualizar a assinatura.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="private-key" className="text-xs font-medium">Conteúdo da Chave</Label>
              <Textarea
                id="private-key"
                placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
                className="min-h-[200px] font-mono text-[10px] resize-none bg-muted/20 focus-visible:ring-primary/20"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button 
                onClick={handleUpdateKey} 
                disabled={isLoading || !privateKey.trim()}
                className="h-9 px-6 text-xs"
              >
                {isLoading ? "Processando..." : "Atualizar Chave"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
