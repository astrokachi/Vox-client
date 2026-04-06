import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [

  route("login", "routes/auth/login.tsx"),
  route("auth/session", "routes/auth/session.tsx"),
  route("api/user/profile", "routes/api/user-profile.ts"),

  layout("routes/dashboard/index.tsx", [
    index("routes/dashboard/overview.tsx"),

    ...prefix("posts", [
      index("routes/dashboard/posts.tsx"),
      // route(":id", "routes/dashboard/post.tsx")
    ]),

    ...prefix("replies", [
      index("routes/dashboard/replies.tsx"),
    ])
  ]),
] satisfies RouteConfig;
