import { companyService, type UpdateCompanyPayload } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCompanyPayload }) =>
      companyService.updateCompany(id, data),
    onSuccess: () => {
      // Refresh the UI to reflect company changes
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      // If there's a companies query, invalidate it too
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}
