import { redirect } from "react-router";

// Signing in lands on a new post: writing one is the app's main job.
// Overview returns here once it has real insights (see PRODUCT.md).
export async function clientLoader() {
  return redirect("/posts/new");
}

const Home = () => null;

export default Home;
