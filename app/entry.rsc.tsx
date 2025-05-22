import type { ServerRouteObject } from "react-router/rsc";
import { decodeReply, renderToReadableStream } from "../framework/server.ts";
// @ts-expect-error - no types yet
import { manifest } from "virtual:react-manifest";

import {
  type DecodeCallServerFunction,
  matchRSCServerRequest,
} from "react-router/rsc";

const routes = [
  {
    id: "root",
    // lazy: () => import("../routes/root/root.tsx"),
    lazy: () => import("./root.tsx"),
    children: [
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
      // {
      //   id: "favicon",
      //   path: "favicon.ico",
      //   lazy: () => import("./routes/favicon[.]ico.tsx"),
      // },
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

      // {
      //   id: "connections",
      //   path: "connections",
      //   lazy: () => import("./routes/connections/route.tsx"),
      // },
    ],
  },
] satisfies ServerRouteObject[];

// export const routes = [
//   {
//     id: "root",
//     path: "",
//     // requiredCSS: ["/index.css"],
//     lazy: () => import("../routes/root/root.tsx"),
//     children: [
//       {
//         id: "home",
//         index: true,
//         lazy: () => import("../routes/home/home.tsx"),
//       },
//       {
//         id: "about",
//         path: "about",
//         lazy: () => import("../routes/about/about.tsx"),
//       },
//       {
//         id: "parent",
//         path: "parent",
//         lazy: () => import("../routes/parent/parent.tsx"),
//         children: [
//           {
//             id: "parent-index",
//             index: true,
//             lazy: () => import("../routes/parent-index/parent-index.tsx"),
//           },
//           {
//             id: "child",
//             path: "child",
//             lazy: () => import("../routes/child/child.tsx"),
//           },
//         ],
//       },
//       {
//         id: "redirect",
//         path: "redirect",
//         lazy: () => import("../routes/redirect.ts"),
//       },
//     ],
//   },
// ] satisfies ServerRouteObject[];

const decodeCallServer: DecodeCallServerFunction = async (actionId, reply) => {
  const args = await decodeReply(reply);
  const reference = manifest.resolveServerReference(actionId);
  await reference.preload();
  const action = reference.get() as (...args: unknown[]) => Promise<unknown>;
  return action.bind(null, ...args);
};

export default {
  fetch(request, env) {
    globalThis.__hash_env__ = env;
    return matchRSCServerRequest({
      decodeCallServer,
      request,
      routes,
      generateResponse(match) {
        if (match instanceof Response) {
          return match;
        }

        return new Response(renderToReadableStream(match.payload), {
          status: match.statusCode,
          headers: match.headers,
        });
      },
    });
  },
} satisfies ExportedHandler;
