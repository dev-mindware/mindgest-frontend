import { LoginResponse, RegisterData, User } from "@/types";
import { ReferralResponse, RoleResponse } from "@/types/users";
import { api } from "./api";

type LoginData = {
  login: string;
  password: string;
};

type SignUpData = Omit<RegisterData, "confirmPassword" | "terms">;

export const userService = {
  updateData: async (data: LoginData) =>
    api.post<LoginResponse>("/login", data),

  updatePassword: async (data: SignUpData) => {
    return api.post<User>("/profile/me/password", data);
  },

  updateEmail: (data: { email: string }) =>
    api.put<User>("/profile/me/email", data),
  updateRole: async (role: string) =>
    api.patch<RoleResponse>(`/user/update-role/?role=${role}`),
};
