import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next"; 
import { TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } from "@/constants"; 

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAuthToken(token?: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setCookie(TOKEN_COOKIE_KEY, token, { path: "/" });
  } else {
    delete api.defaults.headers.common["Authorization"];
    deleteCookie(TOKEN_COOKIE_KEY, { path: "/" });
  }
}

const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getCookie(REFRESH_TOKEN_COOKIE_KEY) as string | undefined;

    if (!refreshToken) {
      throw new Error("Refresh token não encontrado");
    }

    const response = await axios.post<{ accessToken: string }>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      { refreshToken }
    );

    const newAccessToken = response.data.accessToken;
    setAuthToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    setAuthToken(null);
    deleteCookie(REFRESH_TOKEN_COOKIE_KEY, { path: "/" });
    return null;
  }
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    
    if (original.url.includes("/auth/") || original._retry) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const newToken = await refreshAuthToken();
      
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }

    return Promise.reject(err);
  }
);

const savedToken = getCookie(TOKEN_COOKIE_KEY) as string | undefined;
if (savedToken) {
  setAuthToken(savedToken);
}

export default api;