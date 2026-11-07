import axios from "axios";

/**
 * Public API client for unauthenticated requests
 * Used for public endpoints like document verification
 */
const isBrowser =
  typeof window !== "undefined" && process.env.NODE_ENV !== "test";

export const publicApi = axios.create({
  baseURL: isBrowser
    ? "/api/proxy"
    : process.env.NEXT_PUBLIC_API_URL || "https://mindgest.mindware-vps.cloud/api",
  headers: {
    "Content-Type": "application/json",
    ...(typeof window === "undefined" && process.env.API_KEY
      ? { "x-api-key": process.env.API_KEY }
      : {}),
  },
});

// No authentication interceptors for public API
export default publicApi;
