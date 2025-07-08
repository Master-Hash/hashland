import {
  decodeAction,
  decodeReply,
  loadServerAction,
  renderToReadableStream,
} from "@vitejs/plugin-rsc/rsc";
import { unstable_matchRSCServerRequest as matchRSCServerRequest } from "react-router";

// import routes from "../app/routes.ts?react-router-routes";
// import routes from "../ff/app/routes.ts?react-router-routes";

const routes = [
  {
    id: "root",
    lazy: () => import("./root.tsx"),
    children: [
      // {
      //   id: "favicon",
      //   path: "favicon.ico",
      //   lazy: () => import("./routes/favicon[.]ico.tsx"),
      // },
      {
        id: "index",
        index: true,
        lazy: () => import("./routes/_index/route.tsx"),
      },
      {
        id: "bevy-logical-resolution",
        path: "bevy-logical-resolution",
        lazy: () => import("./routes/bevy-logical-resolution/route.tsx"),
      },
      {
        id: "connections",
        path: "connections",
        lazy: () => import("./routes/connections/route.tsx"),
      },
      {
        id: "kami",
        path: "kami",
        lazy: () => import("./routes/kami/route.tsx"),
      },
      {
        id: "mailbox",
        path: "mailbox/:msgid",
        lazy: () => import("./routes/mailbox.$msgid/route.tsx"),
      },
      {
        id: "post",
        path: "*",
        lazy: () => import("./routes/_post.$.tsx"),
      },
      {
        id: "now",
        path: "now",
        lazy: () => import("./routes/now/route.tsx"),
      },
      {
        id: "narrative",
        path: "narrative",
        lazy: () => import("./routes/narrative/route.tsx"),
      },
      {
        id: "count8",
        path: "count8",
        lazy: () => import("./routes/count8/route.tsx"),
      },
      {
        id: "email",
        path: "email",
        lazy: () => import("./routes/email/route.tsx"),
      },
      {
        id: "d1-lantency",
        path: "d1-lantency/:testid",
        lazy: () => import("./routes/d1-lantency.$testid.tsx"),
      },
    ],
  },
];

export async function callServer(request: Request) {
  return await matchRSCServerRequest({
    decodeReply,
    decodeAction,
    loadServerAction,
    request,
    routes,
    generateResponse(match) {
      return new Response(renderToReadableStream(match.payload), {
        status: match.statusCode,
        headers: match.headers,
      });
    },
  });
}

export default {
  fetch(request, env) {
    globalThis.__hash_env__ = env;
    return callServer(request);
  },
} satisfies ExportedHandler<Env>;
