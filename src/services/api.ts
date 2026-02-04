import axios from "axios";
import { getAccessToken } from "@/actions/token";
import { reauthenticate } from "@/actions/auth";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://mindgest-api.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

import { currentStoreStore } from "@/stores";

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Inject storeId only for routes that expect it
  const whitelistedRoutes = [
    "invoice",
    "items",
    "stocks",
    "cash-sessions",
    "reports/dashboard",
    "receipt",
    "documents",
    "dashboard",
    "credit-note",
  ];

  const isGlobalRoute =
    config.url?.includes("global") || config.url?.includes("public");
  const shouldInject =
    config.url &&
    whitelistedRoutes.some((route) => config.url?.includes(route)) &&
    !isGlobalRoute;

  if (shouldInject) {
    const currentStore = currentStoreStore.getState().currentStore;
    if (currentStore?.id) {
      // For GET requests, add to params
      if (config.method === "get") {
        config.params = {
          ...config.params,
          storeId: config.params?.storeId || currentStore.id,
        };
      }
      // For other requests, add to data if it's an object
      else if (
        config.data &&
        typeof config.data === "object" &&
        !config.data.storeId
      ) {
        config.data = {
          ...config.data,
          storeId: currentStore.id,
        };
      }
      // If no data is present but it's a POST/PUT/PATCH, we might want to add storeId
      else if (
        !config.data &&
        ["post", "put", "patch"].includes(config.method || "")
      ) {
        config.data = { storeId: currentStore.id };
      }
    }
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
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = "Bearer " + token;
            return api(original);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await reauthenticate();
        const newToken = await getAccessToken();

        if (newToken) {
          processQueue(null, newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error("Erro ao renovar token:", refreshError);
        window.location.replace("/auth/login");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  },
);

export default api;
