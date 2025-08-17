import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { TOKEN_COOKIE_KEY } from "@/constants";
import { refreshToken } from "@/actions/login";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://GoCommerce.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setCookie(TOKEN_COOKIE_KEY, token, { path: "/" });
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

const savedToken = getCookie(TOKEN_COOKIE_KEY) as string | undefined;
if (savedToken) {
  console.log("TOKEN SALVO:" + savedToken);
  api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const { accessToken } = await refreshToken();

        if (accessToken) {
          setAuthToken(accessToken); // já seta no Axios e salva o cookie

          original.headers.Authorization = `Bearer ${accessToken}`;
          return api(original); // refaz a requisição
        }
      } catch (refreshError) {
        console.error("Erro ao tentar refresh token:", refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
