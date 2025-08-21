import axios from "axios";
import { getAccessToken } from "@/app/actions/token";
import { reauthenticate } from "@/app/actions/auth";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (original.url.includes("/auth/") || original._retry) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401) {
      original._retry = true;
      try {
        await reauthenticate();
        
        const newToken = await getAccessToken();
        if (newToken) {
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        }

      } catch (refreshError) {
        console.error("Erro ao renovar token:", refreshError);
        window.location.replace("/auth/login");
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

export default api;