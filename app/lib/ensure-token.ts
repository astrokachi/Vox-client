import { setAccessToken, getAccessToken, isTokenExpiredOrExpiring } from '~/lib/auth';

let refreshPromise: Promise<string> | null = null;

const API_BASE = import.meta.env.VITE_API_URL;

export async function fetchRefreshToken(): Promise<string> {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = '/logout';
      throw new Error('Session expired');
    }
    throw new Error('Token refresh failed');
  }

  const body = await response.json();
  const newToken = body.data;

  if (!newToken) {
    throw new Error('Invalid refresh response: no access token');
  }

  setAccessToken(newToken);
  return newToken;
}

export async function ensureToken(): Promise<string> {
  const token = getAccessToken();
  if (token && !isTokenExpiredOrExpiring(token)) {
    return token;
  }

  if (!refreshPromise) {
    refreshPromise = fetchRefreshToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
