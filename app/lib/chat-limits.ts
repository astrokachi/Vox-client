import { isApiError } from "~/api/error";

// The server's message when a request was refused because the user is out of
// free drafts; null for any other failure.
export const draftLimitMessage = (err: unknown): string | null =>
  isApiError(err) && err.code === "FORBIDDEN" ? err.message : null;
