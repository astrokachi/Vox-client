const API_BASE = import.meta.env.VITE_API_URL;

export const routes = {
  auth: {
    authorize: `${API_BASE}/auth/authorize`,
    session: '/auth/session',
  },

  user: {
    profile: `${API_BASE}/user/profile`,
  }
} as const;
