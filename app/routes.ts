import type { RouteConfig } from "@react-router/dev/routes";

import { index, route } from "@react-router/dev/routes";
// import { route } from "@react-router/dev/routes";
// import { flatRoutes } from "@react-router/fs-routes";

// const routes: RouteConfig = flatRoutes();
// export const routes: RouteConfig = [
// route("narrative", "./routes/narrative/route.tsx"),
// route("post/*", "./routes/post.$.tsx"),
// route("/", "./routes/_index/route.tsx"),
// route("/favicon.ico", "./routes/favicon[.]ico.tsx"),
// layout("./routes/post.tsx", [route("post/*", "./routes/post.$.tsx")]),
// ];

const routes = [
  index("./routes/_index/route.tsx"),
  route(
    "bevy-logical-resolution",
    "./routes/bevy-logical-resolution/route.tsx",
  ),
] satisfies RouteConfig;

export const root = "./routes/root.tsx";

export default routes;
