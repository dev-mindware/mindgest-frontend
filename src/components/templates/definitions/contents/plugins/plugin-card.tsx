"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Card,
  CardContent,
  Icon,
  SelectField,
} from "@/components";
import type { MindschoolConnection, StoreResponse } from "@/types";
import { formatDateTime } from "@/utils";

export type PluginState = "connected" | "incomplete" | "disconnected";

export function getPluginState(
  connections: MindschoolConnection[],
): PluginState {
  const active = connections.filter((c) => c.status === "ACTIVE");
  if (active.length === 0) return "disconnected";
  return active.every((c) => c.configurationComplete)
    ? "connected"
    : "incomplete";
}

const STATE_BADGE: Record<
  PluginState,
  { label: string; className: string; icon: "CircleCheck" | "TriangleAlert" | "Unplug" }
> = {
  connected: {
    label: "Conectado",
    className:
      "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    icon: "CircleCheck",
  },
  incomplete: {
    label: "Configuração incompleta",
    className:
      "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10",
    icon: "TriangleAlert",
  },
  disconnected: {
    label: "Não conectado",
    className: "text-muted-foreground",
    icon: "Unplug",
  },
};

interface PluginCardProps {
  connections: MindschoolConnection[];
  stores: StoreResponse[];
  isConnecting: boolean;
  connectLabel: string;
  isDisconnecting: boolean;
  isTesting: boolean;
  onConnect: (storeId: string) => void;
  onCancelConnect: () => void;
  onDisconnect: (connectionId: string) => void;
  onTest: () => void;
  onOpenServices: (connectionId: string) => void;
}

export function PluginCard({
  connections,
  stores,
  isConnecting,
  connectLabel,
  isDisconnecting,
  isTesting,
  onConnect,
  onCancelConnect,
  onDisconnect,
  onTest,
  onOpenServices,
}: PluginCardProps) {
  const [storeId, setStoreId] = useState("");
  const [toDisconnect, setToDisconnect] = useState<MindschoolConnection | null>(
    null,
  );
  const active = connections.filter((c) => c.status === "ACTIVE");
  const state = getPluginState(connections);
  const badge = STATE_BADGE[state];
  const storeOptions = stores
    .filter((s) => s.isActive)
    .map((s) => ({ value: s.id, label: s.name }));

  return (
    <Card className="border-border/80 bg-card/60">
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon name="GraduationCap" className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">MindSchool</h3>
              <p className="max-w-xl text-sm text-muted-foreground">
                Quando a secretaria da escola marca uma cobrança como paga, o
                MindSchool pede ao MindGest a factura-recibo. Toda a facturação
                é emitida aqui, com as suas séries e impostos.
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`shrink-0 gap-1.5 px-3 py-1 ${badge.className}`}
          >
            <Icon name={badge.icon} className="h-3.5 w-3.5" />
            {badge.label}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          {state === "connected" &&
            "Tudo pronto: os pagamentos registados na escola geram facturas-recibo automaticamente."}
          {state === "incomplete" &&
            "Há serviços da escola sem imposto definido. A escola continua a registar pagamentos, mas as facturas desses serviços ficam em espera até definir o imposto."}
          {state === "disconnected" &&
            "Ligue uma escola para começar. O titular da escola no MindSchool terá de aceitar a ligação numa janela própria."}
        </p>

        {active.length > 0 && (
          <ul className="divide-y rounded-lg border">
            {active.map((c) => (
              <li
                key={c.id}
                className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="space-y-1 text-sm">
                  <p className="font-medium">
                    {c.school.name ?? "Escola"}
                    {c.school.nif ? (
                      <span className="ml-2 font-normal text-muted-foreground">
                        NIF {c.school.nif}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-muted-foreground">
                    Emite pela loja <strong>{c.store.name}</strong> ·{" "}
                    {c.documents} {c.documents === 1 ? "documento" : "documentos"}
                  </p>
                  <p className="text-muted-foreground">
                    Última sincronização:{" "}
                    {c.lastWebhookOkAt
                      ? formatDateTime(c.lastWebhookOkAt)
                      : "ainda sem sincronização"}
                  </p>
                  {!c.configurationComplete && (
                    <p className="text-amber-600 dark:text-amber-400">
                      {c.servicesPendingTax}{" "}
                      {c.servicesPendingTax === 1
                        ? "serviço sem imposto"
                        : "serviços sem imposto"}
                    </p>
                  )}
                  {c.lastError && (
                    <p className="text-destructive">Último erro: {c.lastError}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenServices(c.id)}
                  >
                    <Icon name="ListChecks" className="mr-1.5 h-4 w-4" />
                    Serviços
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isTesting}
                    onClick={onTest}
                  >
                    <Icon name="RefreshCw" className="mr-1.5 h-4 w-4" />
                    Testar ligação
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isDisconnecting}
                    onClick={() => setToDisconnect(c)}
                  >
                    Desconectar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <SelectField
            className="sm:w-72"
            label="Loja que emite as facturas"
            placeholder="Seleccione a loja"
            value={storeId}
            options={storeOptions}
            onValueChange={setStoreId}
          />
          <Button
            disabled={!storeId || isConnecting}
            onClick={() => onConnect(storeId)}
          >
            {isConnecting ? connectLabel : "Conectar"}
          </Button>
          {isConnecting && (
            <Button variant="ghost" onClick={onCancelConnect}>
              Cancelar
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Cada escola liga-se a uma só empresa; a mesma empresa pode ligar
          várias escolas. A série das facturas é a da loja escolhida.
        </p>
      </CardContent>

      <AlertDialog
        open={Boolean(toDisconnect)}
        onOpenChange={(open) => !open && setToDisconnect(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desconectar esta escola?</AlertDialogTitle>
            <AlertDialogDescription>
              As chaves de acesso de {toDisconnect?.school.name ?? "esta escola"}{" "}
              são revogadas e o MindSchool deixa de poder emitir facturas.
              As facturas já emitidas mantêm-se. Os pagamentos continuam a
              registar-se na escola, com a factura em espera.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDisconnect) onDisconnect(toDisconnect.id);
                setToDisconnect(null);
              }}
            >
              Desconectar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
