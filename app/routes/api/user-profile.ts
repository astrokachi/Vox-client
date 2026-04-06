import { data } from "react-router";
import type { Route } from "./+types/user-profile";
import { getSession } from "~/sessions.server";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("jwtoken");

  if (!token) {
    return data({ status: false, message: "Not authenticated" }, { status: 401 });
  }

  try {
    const res = await axios.get(`${API_BASE}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data(res.data);
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    return data(
      { status: false, message: "Failed to fetch profile" },
      { status: 502 }
    );
  }
}
