import { useRouteLoaderData } from "react-router";
import type { clientLoader as dashboardLoader } from "~/routes/dashboard/index";
import type { User } from "~/types";

// The signed-in user, decoded by the dashboard layout's loader.
export const useCurrentUser = (): User | undefined =>
  useRouteLoaderData<typeof dashboardLoader>("routes/dashboard/index")?.user;
