import { redirect } from 'react-router';
import { API_BASE } from '~/api/client';
import { clearAccessToken } from '~/lib/auth';

export async function loader() {
  return null;
}

export async function clientLoader() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST'
    });
  } catch (error) {
    console.error("Logout API call failed:", error);
  }

  clearAccessToken();

  return redirect("/login");
}

clientLoader.hydrate = true as const;

const Logout = () => null;

export default Logout;
