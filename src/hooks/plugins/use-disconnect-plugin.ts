import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pluginsService } from "@/services";
import { SucessMessage } from "@/utils/messages";
import { PLUGINS_STATUS_KEY } from "./use-plugins-status";

export function useDisconnectPlugin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: string) =>
      pluginsService.disconnect(connectionId),
    onSuccess: () => {
      SucessMessage("Escola desconectada. As chaves de acesso foram revogadas.");
      queryClient.invalidateQueries({ queryKey: PLUGINS_STATUS_KEY });
    },
  });
}
