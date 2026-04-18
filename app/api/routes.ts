const API_BASE = import.meta.env.VITE_API_URL;

export const routes = {
  auth: {
    authorize: `${API_BASE}/auth/authorize`,
    session: '/auth/session',
  },
  user: {
    profile: `${API_BASE}/user/profile`,
  },
  campaign: {
    reply: `${API_BASE}/api/reply`,
    post: `${API_BASE}/api/post`
  },
  conversation: {
    create: `${API_BASE}/api/conversations`,
    get: `${API_BASE}/api/conversations`


  }
} as const;
