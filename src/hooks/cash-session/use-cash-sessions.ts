import {
  useMutation,
  useQueryClient,
  useQuery,
  type QueryClient,
} from "@tanstack/react-query";
import { cashSessionsService } from "@/services/cash-sessions-service";
import { SucessMessage, ErrorMessage } from "@/utils/messages";
import {
  CashSession,
  CashSessionRequestFilters,
  AuthorizeOpeningPayload,
} from "@/types/cash-session";
import { usePagination } from "@/hooks/common";

function removeOpeningRequestFromCache(
  queryClient: QueryClient,
  requestId: string,
) {
  queryClient.setQueriesData(
    { queryKey: ["opening-requests"] },
    (requests: unknown) =>
      Array.isArray(requests)
        ? requests.filter((request) => request.id !== requestId)
        : requests,
  );
}

export function useGetCashSessions(params: any) {
  return usePagination<CashSession>({
    endpoint: "/cash-sessions",
    queryKey: ["cash-sessions"],
    queryParams: params,
  });
}

export function useGetOpeningRequests(filters?: CashSessionRequestFilters) {
  return useQuery({
    queryKey: ["opening-requests", filters],
    queryFn: () => cashSessionsService.getOpeningRequests(filters as any),
  });
}

export function useGetCurrentSession(storeId?: string) {
  return useQuery({
    queryKey: ["current-cash-session", storeId],
    queryFn: () => cashSessionsService.getCurrentSession(storeId),
    retry: false,
    refetchOnWindowFocus: true,
    // Enquanto não há sessão aberta, faz polling para refletir automaticamente
    // uma abertura aprovada por um gestor noutro dispositivo. Pára ao abrir.
    refetchInterval: (query) => (query.state.data?.isOpen ? false : 15000),
  });
}

export function useOpenCashSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId: _requestId, ...data }: any) =>
      cashSessionsService.authorizeOpening(data),
    onSuccess: (_response, variables) => {
      if (variables.requestId) {
        removeOpeningRequestFromCache(queryClient, variables.requestId);
      }
      queryClient.invalidateQueries({ queryKey: ["opening-requests"] });
      queryClient.invalidateQueries({ queryKey: ["cash-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["current-cash-session"] });
      SucessMessage("Caixa aberto com sucesso!");
    },
    onError: (error: any) => {
      ErrorMessage(
        error?.response?.data?.message || "Ocorreu um erro ao abrir o caixa",
      );
    },
  });
}

export function useAuthorizeOpening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AuthorizeOpeningPayload) =>
      cashSessionsService.authorizeOpening(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opening-requests"] });
      queryClient.invalidateQueries({ queryKey: ["cash-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["current-cash-session"] });
      SucessMessage("Pedido aprovado com sucesso.");
    },
    onError: (error: any) => {
      ErrorMessage(
        error?.response?.data?.message || "Não foi possível aprovar o pedido.",
      );
    },
  });
}

export function useRejectOpeningRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) =>
      cashSessionsService.rejectOpeningRequest(requestId),
    onMutate: async (requestId) => {
      await queryClient.cancelQueries({ queryKey: ["opening-requests"] });
      const previousRequests = queryClient.getQueriesData({
        queryKey: ["opening-requests"],
      });

      removeOpeningRequestFromCache(queryClient, requestId);
      return { previousRequests };
    },
    onSuccess: () => {
      SucessMessage("Pedido recusado com sucesso.");
    },
    onError: (error: any, _requestId, context) => {
      context?.previousRequests.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      ErrorMessage(
        error?.response?.data?.message || "Não foi possível recusar o pedido.",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["opening-requests"] });
    },
  });
}

export function useUpdateCashSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      cashSessionsService.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-sessions"] });
      SucessMessage("Sessão actualizada com sucesso");
    },
    onError: (error: any) => {
      ErrorMessage(
        error?.response?.data?.message || "Não foi possível actualizar a sessão",
      );
    },
  });
}

export function useCloseCashSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      cashSessionsService.closeSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["current-cash-session"] });
      SucessMessage("Sessão fechada com sucesso!");
    },
    onError: (error: any) => {
      ErrorMessage(
        error?.response?.data?.message || "Erro ao fechar sessão.",
      );
    },
  });
}

export function useDeleteCashSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cashSessionsService.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-sessions"] });
      SucessMessage("Sessão excluída com sucesso");
    },
    onError: (error: any) => {
      ErrorMessage(error?.response?.data?.message || "Erro ao excluir sessão");
    },
  });
}
