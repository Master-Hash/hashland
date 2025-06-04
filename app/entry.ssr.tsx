import {
  createFromReadableStream,
  getAssetsManifest,
  initialize,
} from "@hiogawa/vite-rsc/ssr";
// @ts-ignore
import { renderToReadableStream } from "react-dom/server.edge";
import { RSCStaticRouter, routeRSCServerRequest } from "react-router";

import { NonceContext } from "./nonce.client.tsx";

initialize();

let mod;

const m = {
  async fetch(request, { SERVER }) {
    const callServer = async (request: Request) => await SERVER.fetch(request);
    return handler(request, callServer);
  },
} satisfies ExportedHandler<Env>;

async function handler(
  request: Request,
  callServer: (request: Request) => Promise<Response>,
) {
  const u = new URL(request.url);
  if (u.pathname === "/favicon.ico") {
    // console.log(u);
    if (request.headers.get("Accept")?.includes("image/svg+xml")) {
      return new Response(
        // '<svg version="2.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><defs><style>.l{fill:none;stroke:black;stroke-width:.36}@media (prefers-color-scheme:dark){.l{stroke:white}}</style></defs><g transform="translate(-1 -1)"><polygon class="l" points="15.727406610312546 5.929447639179834, 5.17157287525381 5.17157287525381, 5.929447639179835 15.727406610312546, 11.863703305156273 6.964723819589917, 2.3431457505076203 2.3431457505076194, 6.964723819589917 11.863703305156273"/><line class="l" x1="8" y1="8" x2="15.727406610312546" y2="5.929447639179834"/><line class="l" x1="8" y1="8" x2="2.3431457505076203" y2="2.3431457505076194"/><line class="l" x1="8" y1="8" x2="5.929447639179835" y2="15.727406610312546"/></g></svg>',
        new Uint8Array([
          60, 115, 118, 103, 32, 118, 101, 114, 115, 105, 111, 110, 61, 34, 50,
          46, 48, 34, 32, 120, 109, 108, 110, 115, 61, 34, 104, 116, 116, 112,
          58, 47, 47, 119, 119, 119, 46, 119, 51, 46, 111, 114, 103, 47, 50, 48,
          48, 48, 47, 115, 118, 103, 34, 32, 118, 105, 101, 119, 66, 111, 120,
          61, 34, 48, 32, 48, 32, 49, 54, 32, 49, 54, 34, 62, 60, 100, 101, 102,
          115, 62, 60, 115, 116, 121, 108, 101, 62, 46, 108, 123, 102, 105, 108,
          108, 58, 110, 111, 110, 101, 59, 115, 116, 114, 111, 107, 101, 58, 98,
          108, 97, 99, 107, 59, 115, 116, 114, 111, 107, 101, 45, 119, 105, 100,
          116, 104, 58, 46, 51, 54, 125, 64, 109, 101, 100, 105, 97, 32, 40,
          112, 114, 101, 102, 101, 114, 115, 45, 99, 111, 108, 111, 114, 45,
          115, 99, 104, 101, 109, 101, 58, 100, 97, 114, 107, 41, 123, 46, 108,
          123, 115, 116, 114, 111, 107, 101, 58, 119, 104, 105, 116, 101, 125,
          125, 60, 47, 115, 116, 121, 108, 101, 62, 60, 47, 100, 101, 102, 115,
          62, 60, 103, 32, 116, 114, 97, 110, 115, 102, 111, 114, 109, 61, 34,
          116, 114, 97, 110, 115, 108, 97, 116, 101, 40, 45, 49, 32, 45, 49, 41,
          34, 62, 60, 112, 111, 108, 121, 103, 111, 110, 32, 99, 108, 97, 115,
          115, 61, 34, 108, 34, 32, 112, 111, 105, 110, 116, 115, 61, 34, 49,
          53, 46, 55, 50, 55, 52, 48, 54, 54, 49, 48, 51, 49, 50, 53, 52, 54,
          32, 53, 46, 57, 50, 57, 52, 52, 55, 54, 51, 57, 49, 55, 57, 56, 51,
          52, 44, 32, 53, 46, 49, 55, 49, 53, 55, 50, 56, 55, 53, 50, 53, 51,
          56, 49, 32, 53, 46, 49, 55, 49, 53, 55, 50, 56, 55, 53, 50, 53, 51,
          56, 49, 44, 32, 53, 46, 57, 50, 57, 52, 52, 55, 54, 51, 57, 49, 55,
          57, 56, 51, 53, 32, 49, 53, 46, 55, 50, 55, 52, 48, 54, 54, 49, 48,
          51, 49, 50, 53, 52, 54, 44, 32, 49, 49, 46, 56, 54, 51, 55, 48, 51,
          51, 48, 53, 49, 53, 54, 50, 55, 51, 32, 54, 46, 57, 54, 52, 55, 50,
          51, 56, 49, 57, 53, 56, 57, 57, 49, 55, 44, 32, 50, 46, 51, 52, 51,
          49, 52, 53, 55, 53, 48, 53, 48, 55, 54, 50, 48, 51, 32, 50, 46, 51,
          52, 51, 49, 52, 53, 55, 53, 48, 53, 48, 55, 54, 49, 57, 52, 44, 32,
          54, 46, 57, 54, 52, 55, 50, 51, 56, 49, 57, 53, 56, 57, 57, 49, 55,
          32, 49, 49, 46, 56, 54, 51, 55, 48, 51, 51, 48, 53, 49, 53, 54, 50,
          55, 51, 34, 47, 62, 60, 108, 105, 110, 101, 32, 99, 108, 97, 115, 115,
          61, 34, 108, 34, 32, 120, 49, 61, 34, 56, 34, 32, 121, 49, 61, 34, 56,
          34, 32, 120, 50, 61, 34, 49, 53, 46, 55, 50, 55, 52, 48, 54, 54, 49,
          48, 51, 49, 50, 53, 52, 54, 34, 32, 121, 50, 61, 34, 53, 46, 57, 50,
          57, 52, 52, 55, 54, 51, 57, 49, 55, 57, 56, 51, 52, 34, 47, 62, 60,
          108, 105, 110, 101, 32, 99, 108, 97, 115, 115, 61, 34, 108, 34, 32,
          120, 49, 61, 34, 56, 34, 32, 121, 49, 61, 34, 56, 34, 32, 120, 50, 61,
          34, 50, 46, 51, 52, 51, 49, 52, 53, 55, 53, 48, 53, 48, 55, 54, 50,
          48, 51, 34, 32, 121, 50, 61, 34, 50, 46, 51, 52, 51, 49, 52, 53, 55,
          53, 48, 53, 48, 55, 54, 49, 57, 52, 34, 47, 62, 60, 108, 105, 110,
          101, 32, 99, 108, 97, 115, 115, 61, 34, 108, 34, 32, 120, 49, 61, 34,
          56, 34, 32, 121, 49, 61, 34, 56, 34, 32, 120, 50, 61, 34, 53, 46, 57,
          50, 57, 52, 52, 55, 54, 51, 57, 49, 55, 57, 56, 51, 53, 34, 32, 121,
          50, 61, 34, 49, 53, 46, 55, 50, 55, 52, 48, 54, 54, 49, 48, 51, 49,
          50, 53, 52, 54, 34, 47, 62, 60, 47, 103, 62, 60, 47, 115, 118, 103,
          62,
        ]),
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
  const h: HeadersInit = new Headers();
  h.set(
    "content-security-policy",
    `default-src 'self'; script-src 'self' 'unsafe-eval'; script-src-elem 'self' 'nonce-${nonce}'${import.meta.env.PROD ? " https://static.cloudflareinsights.com/" : ""}; worker-src 'self' blob:; img-src 'self' data:` +
      (import.meta.env.DEV
        ? "; style-src-elem 'unsafe-inline'"
        : "; connect-src 'self' https://cloudflareinsights.com/"),
  );

  return routeRSCServerRequest({
    request,
    callServer,
    decode: (body) => createFromReadableStream(body),
    renderHTML(getPayload) {
      return renderToReadableStream(
        <NonceContext value={nonce}>
          <RSCStaticRouter getPayload={getPayload} nonce={nonce} />
        </NonceContext>,
        {
          bootstrapModules: new URL(request.url).searchParams.has("__nojs")
            ? []
            : getAssetsManifest().entry.bootstrapModules,
          signal: request.signal,
          nonce,
        },
      );
    },
    hydrate: true,
    nonce,
    entryHeaders: h,
  });
}

if (import.meta.env.DEV) {
  mod = handler;
}
if (import.meta.env.PROD) {
  mod = m;
}

export default mod;
