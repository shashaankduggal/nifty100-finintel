const ACCESS_KEY = "nifty100_access_token";
const REFRESH_KEY = "nifty100_refresh_token";
const USER_KEY = "nifty100_user";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
}

function readJson(key) {
  const storage = getStorage();
  if (!storage) return null;

  const raw = storage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const tokenStorage = {
  getAccessToken() {
    const storage = getStorage();
    return storage?.getItem(ACCESS_KEY) ?? null;
  },
  getRefreshToken() {
    const storage = getStorage();
    return storage?.getItem(REFRESH_KEY) ?? null;
  },
  getUser() {
    return readJson(USER_KEY);
  },
  setSession({ accessToken, refreshToken, user }) {
    const storage = getStorage();
    if (!storage) return;

    if (accessToken) storage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) storage.setItem(REFRESH_KEY, refreshToken);
    if (user) storage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    const storage = getStorage();
    if (!storage) return;

    storage.removeItem(ACCESS_KEY);
    storage.removeItem(REFRESH_KEY);
    storage.removeItem(USER_KEY);
  },
};

