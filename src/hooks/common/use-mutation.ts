import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { AxiosError } from "axios";

type HTTPMethod = "post" | "put" | "delete" | "patch";

/**
 * @param method - método HTTP
 * @param endpoint - caminho da API
 * @param keyToInvalidate - chave do cache a ser invalidada após sucesso
 */
export function useCustomMutation<TResponse, TVariables>(
  method: HTTPMethod,
  endpoint: string,
  keyToInvalidate?: string
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, Error, TVariables>({
    mutationFn: async (data: TVariables) => {
      try {
        const response = await api[method]<TResponse>(endpoint, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          const message =
            error.response?.data?.message || "Erro desconhecido. Tente novamente.";
          throw new Error(message);
        }
        throw new Error("Erro inesperado");
      }
    },
    onSuccess: () => {
      if (keyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: [keyToInvalidate] });
      }
    },
    onError: (error) => {
      console.error("Erro na mutação:", error.message);
    },
  });
}
