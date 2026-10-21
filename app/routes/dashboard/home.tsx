import { redirect } from "react-router";

// The writing flow starts from Posts. Overview returns here once it has
// real insights (see PRODUCT.md).
export async function clientLoader() {
  return redirect("/posts");
}

const Home = () => null;

export default Home;
