import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
  route("login", "routes/auth/login.tsx"),
  route("logout", "routes/auth/logout.tsx"),
  layout("routes/dashboard/index.tsx", [
    index("routes/dashboard/overview.tsx"),

    ...prefix("posts", [
      index("routes/dashboard/posts/index.tsx"),
      route("new", "routes/dashboard/posts/new.tsx"),
      route(":id", "routes/dashboard/posts/[post].tsx"),
      route(":id/r/:messageId", "routes/dashboard/posts/refine-message.tsx"),
    ]),

    ...prefix("replies", [
      index("routes/dashboard/replies.tsx"),
    ])
  ]),
] satisfies RouteConfig;
