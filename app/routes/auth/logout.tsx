import { redirect } from 'react-router';
import { clearAccessToken } from '~/lib/auth';
import { authApi } from '~/api/endpoints';

export async function clientLoader() {
  try {
    await authApi.logout();
  } catch (error) {
    console.error("Logout API call failed:", error);
  }

  clearAccessToken();

  return redirect("/login");
}
