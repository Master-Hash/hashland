// @ts-expect-error
import RSD from "@jacob-ebey/react-server-dom-vite/client";
// @ts-expect-error
import RDS from "react-dom/server.edge";
// @ts-expect-error
import { bootstrapModules, manifest } from "virtual:react-manifest";

import { routeRSCServerRequest, RSCStaticRouter } from "react-router";
import { NonceContext } from "./nonce.client.tsx";

export default {
  async fetch(request, { SERVER }) {
    const callServer = async (request: Request) => await SERVER.fetch(request);

    const u = new URL(request.url);
    if (u.pathname === "/favicon.ico") {
      // console.log(u);
      if (request.headers.get("Accept")?.includes("image/svg+xml")) {
        return new Response(
          '<svg version="2.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><defs><style>.l{fill:none;stroke:black;stroke-width:.36}@media (prefers-color-scheme:dark){.l{stroke:white}}</style></defs><g transform="translate(-1 -1)"><polygon class="l" points="15.727406610312546 5.929447639179834, 5.17157287525381 5.17157287525381, 5.929447639179835 15.727406610312546, 11.863703305156273 6.964723819589917, 2.3431457505076203 2.3431457505076194, 6.964723819589917 11.863703305156273"/><line class="l" x1="8" y1="8" x2="15.727406610312546" y2="5.929447639179834"/><line class="l" x1="8" y1="8" x2="2.3431457505076203" y2="2.3431457505076194"/><line class="l" x1="8" y1="8" x2="5.929447639179835" y2="15.727406610312546"/></g></svg>',
          {
            status: 200,
            headers: {
              "Content-Type": "image/svg+xml",
            },
          },
        );
      } else {
        return Response.redirect(
          new URL("_favicon.ico", import.meta.env.VITE_SITEURL),
          301,
        );
      }
    }
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
    );
    const x = await routeRSCServerRequest({
      request,
      callServer,
      decode: (body) => RSD.createFromReadableStream(body, manifest),
      async renderHTML(getPayload) {
        return await RDS.renderToReadableStream(
          <NonceContext value={nonce}>
            <RSCStaticRouter getPayload={getPayload} nonce={nonce} />
          </NonceContext>,
          {
            bootstrapModules,
            signal: request.signal,
            nonce,
          },
        );
      },
      hydrate: true,
      nonce,
    });
    try {
      x.headers.set(
        "content-security-policy",
        `default-src 'self'; style-src-attr 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval'; script-src-elem 'self' 'nonce-${nonce}'${import.meta.env.PROD ? " https://static.cloudflareinsights.com/" : ""}; worker-src 'self' blob:; img-src 'self' data:` +
          (import.meta.env.DEV
            ? "; style-src-elem 'unsafe-inline'"
            : "; connect-src 'self' https://cloudflareinsights.com/"),
      );
    } catch (e) {}
    return x;
  },
} satisfies ExportedHandler<Env>;
