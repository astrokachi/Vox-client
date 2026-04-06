import { getSession, commitSession } from "~/sessions.server";
import { data } from "react-router";
import type { Route } from "./+types";

export async function action({ request }: Route.ActionArgs) {
  const { token } = await request.json();
  const session = await getSession(
    request.headers.get("Cookie")
  );

  session.set("jwtoken", token);

  return data(
    { success: true },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}
