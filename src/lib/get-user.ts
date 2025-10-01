import api from "@/services/api";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get<User>("/auth/profile");
      return data;
    },
    staleTime: 1000 * 60 * 5, // cache de 5 minutos
    retry: false, // não ficar repetindo se 401
  });
}
