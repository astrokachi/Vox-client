import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "react-router";
import { useState } from "react";
import "~/styles/index.scss";
import "~/styles/components/error-boundary.scss";
import type { Route } from "./+types/root";
import { ToastProvider } from "~/contexts/toast-provider";
import Toast from "~/components/toast";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/png", href: "/vox-small.png" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap",
  },
  {
    rel: "preconnect",
    href: import.meta.env.VITE_SOCKET_URL,
  },
  {
    rel: "dns-prefetch",
    href: import.meta.env.VITE_SOCKET_URL,
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Outlet />
      <Toast />
    </ToastProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const navigate = useNavigate();
  const [showStack, setShowStack] = useState(false);

  let code: string | null = null;
  let title = "Something went wrong";
  let details = "An unexpected error occurred. Please try again.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    code = String(error.status);
    if (error.status === 404) {
      title = "Page not found";
      details = "The page you are looking for does not exist.";
    } else if (error.status === 401) {
      title = "Session expired";
      details = "Please sign in to continue.";
    } else {
      title = `Error ${error.status}`;
      details = error.statusText || details;
    }
  } else if (error instanceof Error) {
    details = error.message;
    if (import.meta.env.DEV) stack = error.stack;
  }

  return (
    <div className="error-boundary">
      {code && <div className="error-boundary-code">{code}</div>}
      <h1>{title}</h1>
      <p>{details}</p>

      <div className="error-boundary-actions">
        <button
          className="error-boundary-btn error-boundary-btn--primary"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
        <button
          className="error-boundary-btn error-boundary-btn--secondary"
          onClick={() => navigate("/")}
        >
          Go home
        </button>
      </div>

      {stack && (
        <div className="error-boundary-details">
          <button
            className="error-boundary-toggle"
            onClick={() => setShowStack((s) => !s)}
          >
            {showStack ? "Hide" : "Show"} details
          </button>
          {showStack && <pre className="error-boundary-stack">{stack}</pre>}
        </div>
      )}
    </div>
  );
}
