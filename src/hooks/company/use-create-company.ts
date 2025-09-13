import { companyService } from "@/services";
import { CompanyData } from "@/types/company";
import { SucessMessage } from "@/utils/messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompanyData) => companyService.addCompany(data),
    onSuccess: () => {
      SucessMessage("Conta criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}
