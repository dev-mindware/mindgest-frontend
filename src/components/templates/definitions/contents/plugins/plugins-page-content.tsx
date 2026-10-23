"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TitleList } from "@/components";
import {
  useConnectMindschool,
  useDisconnectPlugin,
  usePluginsStatus,
} from "@/hooks/plugins";
import { storesService } from "@/services";
import type { StoreResponse } from "@/types";
import { ErrorMessage, InfoMessage, SucessMessage } from "@/utils/messages";
import { getApiErrorMessage } from "@/utils/api-error";
import { MindschoolServices } from "./mindschool-services";
import { PluginCard } from "./plugin-card";

const PHASE_LABEL = {
  idle: "Conectar",
  opening: "A abrir…",
  waiting: "A aguardar a escola…",
  completing: "A concluir…",
} as const;

export function PluginsPageContent() {
  const {
    data: connections = [],
    isLoading,
    refetch,
    isFetching,
  } = usePluginsStatus();
  const { data: stores = [] } = useQuery({
    queryKey: ["stores", "plugins"],
    queryFn: async () => {
      const response = await storesService.getStores();
      return (response.data?.data || []) as StoreResponse[];
    },
  });
  const { connect, cancel, phase, isPending } = useConnectMindschool();
  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectPlugin();
  const [servicesFor, setServicesFor] = useState<string | null>(null);

  const selected = connections.find((c) => c.id === servicesFor);

  async function handleTest() {
    const result = await refetch();
    if (result.error) {
      ErrorMessage(
        getApiErrorMessage(result.error, "Não foi possível verificar a ligação."),
      );
      return;
    }
    const withError = result.data?.find((c) => c.lastError);
    if (withError) {
      ErrorMessage(`${withError.school.name ?? "Escola"}: ${withError.lastError}`);
    } else if (result.data?.some((c) => !c.configurationComplete)) {
      InfoMessage("Ligação activa. Faltam impostos em alguns serviços.");
    } else {
      SucessMessage("Ligação activa e sem erros.");
    }
  }

  return (
    <div data-tour="setup-plugins-content">
      <TitleList
        title="Plugins"
        suTitle="Ligue o MindGest a outras aplicações que precisam de emitir facturas."
      />

      {servicesFor && selected ? (
        <MindschoolServices
          connectionId={selected.id}
          schoolName={selected.school.name ?? "a escola"}
          onBack={() => setServicesFor(null)}
        />
      ) : (
        <div className="mt-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">A carregar…</p>
          ) : (
            <PluginCard
              connections={connections}
              stores={stores}
              isConnecting={isPending}
              connectLabel={PHASE_LABEL[phase]}
              isDisconnecting={isDisconnecting}
              isTesting={isFetching}
              onConnect={(storeId) =>
                connect(
                  storeId,
                  connections.map((c) => c.id),
                )
              }
              onCancelConnect={cancel}
              onDisconnect={(id) => disconnect(id)}
              onTest={handleTest}
              onOpenServices={setServicesFor}
            />
          )}
        </div>
      )}
    </div>
  );
}
