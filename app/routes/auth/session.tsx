import { getSession, commitSession } from "~/sessions.server";
import { data } from "react-router";
import type { Route } from "./+types/session";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("jwtoken");

  return { token };
}

// TODO: find out if this can return an error and handle it
export async function action({ request }: Route.ActionArgs) {

  const session = await getSession(request.headers.get("Cookie"));

  const body = await request.json();

  session.set("jwtoken", body.token);

  const cookie = await commitSession(session);

  return data(
    { ok: true },
    {
      headers: {
        "Set-Cookie": cookie,
      },
    }
  );
}
