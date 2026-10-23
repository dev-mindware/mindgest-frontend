import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pluginsService } from "@/services";
import { SucessMessage } from "@/utils/messages";
import { PLUGINS_STATUS_KEY } from "./use-plugins-status";

export function useIntegrationServices(connectionId: string | null) {
  return useQuery({
    queryKey: ["plugins-services", connectionId],
    queryFn: () => pluginsService.getServices(connectionId as string),
    enabled: Boolean(connectionId),
  });
}

export function useIntegrationTaxes(enabled = true) {
  return useQuery({
    queryKey: ["plugins-taxes"],
    queryFn: () => pluginsService.getTaxes(),
    enabled,
  });
}

export function useSetServiceTax(connectionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, taxId }: { serviceId: string; taxId: string }) =>
      pluginsService.setServiceTax(serviceId, taxId),
    onSuccess: () => {
      SucessMessage("Imposto do serviço definido.");
      queryClient.invalidateQueries({
        queryKey: ["plugins-services", connectionId],
      });
      queryClient.invalidateQueries({ queryKey: PLUGINS_STATUS_KEY });
    },
  });
}
