import { jwtDecode } from 'jwt-decode';
import { fetchRefreshToken } from '~/lib/ensure-token';

let accessToken: string | null = sessionStorage.getItem("token");
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

export const isTokenSet = () => !!accessToken;

export const setAccessToken = (token: string) => {
  if(!token) {
    console.warn("Token not set")
    return;
  }
  accessToken = token;
  sessionStorage.setItem("token", token)
  if (token) {
    scheduleProactiveRefresh(token);
  }
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

function scheduleProactiveRefresh(token: string) {
  if (refreshTimer) clearTimeout(refreshTimer);

  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    const expiresAt = exp * 1000;
    const refreshAt = expiresAt - 60_000;
    const delay = Math.max(0, refreshAt - Date.now());

    refreshTimer = setTimeout(() => {
      fetchRefreshToken().catch(() => {});
    }, delay);
  } catch {
    // malformed token — interceptor handles it
  }
}

export function isTokenExpiredOrExpiring(token: string, thresholdSeconds = 60): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000 - thresholdSeconds * 1000;
  } catch {
    return true;
  }
}
