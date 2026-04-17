import axios from "axios";
import { getAccessToken } from "@/actions/token";

let accessTokenCache: string | null = null;

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

export const resetAccessTokenCache = () => {
  accessTokenCache = null;
};

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
    process.env.NEXT_PUBLIC_API_URL || "https://mindgest.mindware-vps.cloud/api",
  headers: {
    "Content-Type": "application/json",
  },
});

import { currentStoreStore } from "@/stores";

api.interceptors.request.use(async (config) => {
  const url = config.url || "";

  // Rotas públicas de auth não devem enviar Authorization nem tocar no cache de token
  const isPublicAuthRoute =
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/forgot-password") ||
    url.includes("/auth/reset-password");

  if (!isPublicAuthRoute) {
    // Usa o cache se disponível, senão lê dos cookies via server action
    if (!accessTokenCache) {
      accessTokenCache = await getAccessToken();
    }

    if (accessTokenCache) {
      config.headers.Authorization = `Bearer ${accessTokenCache}`;
    }
  }

  // Routes that require storeId injection
  const STORE_DEPENDENT_ROUTES: (
    | string
    | { path: string; methods: string[] }
  )[] = [
      "invoice",
      "items",
      { path: "stocks", methods: ["get"] },
      "cash-sessions",
      "reports/dashboard",
      "receipt",
      "documents",
      "dashboard",
      "stock-reservations",
      { path: "credit-note", methods: ["get"] },
      { path: "categories", methods: ["get", "post"] },
    ];

  // Specific routes or patterns to exclude from injection
  const EXCLUDED_ROUTES = [
    "/expenses",
    "receipt",
    "/close",
    "global",
    "public",
    "/suppliers",
  ];

  const currentMethod = config.method?.toLowerCase() || "";
  const matchingRoute = STORE_DEPENDENT_ROUTES.find((route) => {
    const routePath = typeof route === "string" ? route : route.path;
    return config.url?.includes(routePath);
  });

  const isExcluded = EXCLUDED_ROUTES.some((route) =>
    config.url?.includes(route),
  );

  const shouldInject =
    config.url &&
    matchingRoute &&
    !isExcluded &&
    (typeof matchingRoute === "string" ||
      matchingRoute.methods.includes(currentMethod));

  if (shouldInject) {
    const currentStore = currentStoreStore.getState().currentStore;
    if (currentStore?.id) {
      // For GET requests, add to params
      if (currentMethod === "get") {
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
        ["post", "put", "patch"].includes(currentMethod)
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

    // Ignora refresh loops ou rotas que não levam token
    if (
      original.url.includes("/auth/login") ||
      original.url.includes("/auth/logout") ||
      original.url.includes("/api/auth/refresh") ||
      original._retry
    ) {
      return Promise.reject(err);
    }

    if (err.response?.status === 404) {
      const isAuthCritical =
        original.url.includes("/auth/profile") ||
        original.url.includes("/api/auth/refresh");

      if (isAuthCritical) {
        console.warn("🚨 [API] 404 em rota crítica de auth. Forçando logout.");
        resetAccessTokenCache();
        if (typeof window !== "undefined") {
          window.location.replace("/auth/login");
        }
      }
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
        // Chamada V-Sync à Rota Next.js (que gere os cookies silenciosamente)
        const response = await axios.post("/api/auth/refresh");

        const newToken = response.data?.accessToken;

        if (newToken) {
          accessTokenCache = newToken; // Update cache
          processQueue(null, newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        } else {
          throw new Error("Novo access token não recebido após reautenticação");
        }
      } catch (refreshError) {
        resetAccessTokenCache(); // Clear cache on failure
        processQueue(refreshError, null);
        console.error("Erro ao renovar token:", refreshError);

        if (typeof window !== "undefined") {
          window.location.replace("/auth/login");
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  },
);

export default api;
