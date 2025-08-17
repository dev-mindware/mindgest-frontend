import { LoginResponse, RegisterData, User } from "@/types";
import { api } from "./api";

type LoginData = {
  login: string;
  password: string;
};

type SignUpData = Omit<RegisterData, "confirmPassword" | "terms">

export const authService = {
  login: async (data: LoginData) =>
    api.post<LoginResponse>("/login", data),

  signUp: async (data: SignUpData) => {
    console.log(data)
    return api.post<User>("/sign-up", data)
  },

  getMe: () => api.get<User>("/profile/me"),

  logout: () => api.post("/logout"),
  refreshToken: async () => api.post<{ acessToken: string }>("/refresh"),
  loginWithGoogle: async (token: string) => api.post("/auth/google", { token }),
};
