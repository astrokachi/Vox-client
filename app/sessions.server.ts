import { createCookieSessionStorage } from "react-router";

type SessionData = {
  jwtoken: string;
}

type SessionFlashData = {
  error: string;
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage<SessionData, SessionFlashData>({
  cookie: {
    name: "auth-session",
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
    secrets: [import.meta.env.VITE_SESSION_SECRET],
    // secure: true,
  },
});


export { getSession, commitSession, destroySession };
