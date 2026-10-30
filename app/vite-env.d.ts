/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Same-origin /api proxy (see vercel.json) in production.
    readonly VITE_API_URL: string;
    // The API server itself; Vercel rewrites can't carry websockets.
    readonly VITE_SOCKET_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
