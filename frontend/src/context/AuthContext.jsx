import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { tokenStorage } from "../lib/tokenStorage";

const AuthContext = createContext(null);

function normalizeAuthPayload(data) {
  return {
    accessToken: data?.access ?? data?.tokens?.access ?? null,
    refreshToken: data?.refresh ?? data?.tokens?.refresh ?? null,
    user: data?.user ?? data?.data?.user ?? null,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const nextAccessToken = tokenStorage.getAccessToken();
    const nextRefreshToken = tokenStorage.getRefreshToken();
    const nextUser = tokenStorage.getUser();

    if (nextAccessToken) setAccessToken(nextAccessToken);
    if (nextRefreshToken) setRefreshToken(nextRefreshToken);
    if (nextUser) setUser(nextUser);

    setIsBootstrapping(false);
  }, []);

  const persistSession = (payload) => {
    const normalized = normalizeAuthPayload(payload);
    setAccessToken(normalized.accessToken ?? accessToken);
    setRefreshToken(normalized.refreshToken ?? refreshToken);
    setUser(normalized.user ?? user);
    tokenStorage.setSession(normalized);
    return normalized;
  };

  const login = async (credentials) => {
    const response = await api.post("/auth/login/", credentials);
    persistSession(response.data);
    return response.data;
  };

  const adminLogin = async (credentials) => {
    const response = await api.post("/auth/admin/login/", credentials);
    persistSession(response.data);
    return response.data;
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register/", payload);
    persistSession(response.data);
    return response.data;
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        await api.post("/auth/logout/", { refresh: refreshToken });
      }
    } finally {
      tokenStorage.clear();
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  };

  const refreshSession = async () => {
    if (!refreshToken) {
      return null;
    }

    const response = await api.post("/auth/refresh/", { refresh: refreshToken });
    persistSession(response.data);
    return response.data;
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken || refreshToken),
      isBootstrapping,
      login,
      adminLogin,
      register,
      logout,
      refreshSession,
    }),
    [accessToken, refreshToken, user, isBootstrapping],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
