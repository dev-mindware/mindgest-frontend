import { userService, type ChangeUserPasswordPayload } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ChangeUserPasswordPayload;
    }) => userService.changePassword(id, data),
    onSuccess: () => {
      // Invalidate the user/auth queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
