import { ClientData, ClientResponse, ItemData } from "@/types";
import { clientsService } from "@/services/clients-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SucessMessage } from "@/utils/messages";
import { usePagination } from "../common";

export function useAddClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClientData) => clientsService.addClient(data),
    onSuccess: () => {
      SucessMessage("Cliente adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemData> }) =>
      clientsService.updateClient(id, data as any),
    onSuccess: () => {
      SucessMessage("Cliente atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useToggleStatusClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientsService.toggleStatusClient(id),
    onSuccess: () => {
      SucessMessage("Cliente desativado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useGetClients() {
  const pagination = usePagination<ClientResponse>({
    endpoint: "/clients",
    queryKey: "clients",
  });

  const clientOptions = pagination.data.map((client) => ({
    label: `${client.name} (${client.email})`,
    value: client.id,
  }));

  return {
    ...pagination,
    clients: pagination.data,
    clientOptions,
    pagination: {
      page: pagination.page,
      totalPages: pagination.totalPages,
    },
  };
}