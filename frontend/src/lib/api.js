import axios from "axios";
import { tokenStorage } from "./tokenStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

function applyAccessToken(config) {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}

api.interceptors.request.use((config) => {
  const nextConfig = config;
  nextConfig.headers = nextConfig.headers ?? {};
  return applyAccessToken(nextConfig);
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      tokenStorage.clear();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    refreshPromise ??= axios.post(
      `${baseURL}/auth/refresh/`,
      { refresh: refreshToken },
      { withCredentials: true },
    );

    try {
      const response = await refreshPromise;
      refreshPromise = null;

      const nextAccessToken =
        response.data?.access ?? response.data?.tokens?.access ?? null;
      const nextRefreshToken =
        response.data?.refresh ?? response.data?.tokens?.refresh ?? null;

      tokenStorage.setSession({
        accessToken: nextAccessToken,
        refreshToken: nextRefreshToken ?? refreshToken,
        user: response.data?.user ?? tokenStorage.getUser(),
      });

      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      refreshPromise = null;
      tokenStorage.clear();
      return Promise.reject(refreshError);
    }
  },
);
