import { useQuery } from "@tanstack/react-query";
import { pluginsService } from "@/services";

export const PLUGINS_STATUS_KEY = ["plugins-status"] as const;

export function usePluginsStatus(enabled = true) {
  return useQuery({
    queryKey: PLUGINS_STATUS_KEY,
    queryFn: () => pluginsService.getStatus(),
    enabled,
  });
}
