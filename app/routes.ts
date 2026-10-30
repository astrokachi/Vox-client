import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
  route("login", "routes/auth/login.tsx"),
  route("logout", "routes/auth/logout.tsx"),
  layout("routes/dashboard/index.tsx", [
    // Overview (routes/dashboard/overview.tsx) and Replies (routes/dashboard/replies.tsx)
    // are kept but unrouted until they are real features — see PRODUCT.md.
    index("routes/dashboard/home.tsx"),

    ...prefix("posts", [
      // All and Published share the Posts header and tabs.
      layout("routes/dashboard/posts/list-layout.tsx", [
        index("routes/dashboard/posts/index.tsx"),
        route("published", "routes/dashboard/posts/published.tsx"),
      ]),
      route("new", "routes/dashboard/posts/new.tsx"),
      route(":id", "routes/dashboard/posts/[post].tsx"),
      route(":id/r/:messageId", "routes/dashboard/posts/refine-message.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
