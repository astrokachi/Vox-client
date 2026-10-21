import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
  route("login", "routes/auth/login.tsx"),
  route("logout", "routes/auth/logout.tsx"),
  layout("routes/dashboard/index.tsx", [
    // Overview (routes/dashboard/overview.tsx) and Replies (routes/dashboard/replies.tsx)
    // are kept but unrouted until they are real features — see PRODUCT.md.
    index("routes/dashboard/home.tsx"),

    ...prefix("posts", [
      index("routes/dashboard/posts/index.tsx"),
      route("new", "routes/dashboard/posts/new.tsx"),
      route(":id", "routes/dashboard/posts/[post].tsx"),
      route(":id/r/:messageId", "routes/dashboard/posts/refine-message.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
