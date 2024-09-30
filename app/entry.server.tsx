import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";

import { NonceContext } from "./utils/components";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: AppLoadContext,
) {
  // How to set up a nonce:
  // https://github.com/remix-run/remix/issues/5162#issuecomment-1400748264
  const nonce = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
  );
  const body = await renderToReadableStream(
    <NonceContext.Provider value={nonce}>
      <ServerRouter context={routerContext} url={request.url} nonce={nonce} />
    </NonceContext.Provider>,
    {
      signal: request.signal,
      onError(error: unknown) {
        // Log streaming rendering errors from inside the shell
        console.error(error);
        responseStatusCode = 500;
      },
      nonce,
    },
  );

  const userAgent = request.headers.get("user-agent");
  if (userAgent && isbot(userAgent)) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  // Notes about CSP:
  // style-src-attr: shiki uses unsafe-inline
  // script-src: vega(now unused), pixi use unsafe-eval, bevy uses wasm-unsafe-eval
  // script-src-elem: React Router uses nonce
  // we avoid using unsafe-inline, and React DevTools in Firefox breaks dramatically
  // see https://github.com/facebook/react-devtools/issues/460
  // worker-src: pixi uses blob
  // img-src: we use data: for iconify icons
  // should modify if different libraries are used
  responseHeaders.set(
    "content-security-policy",
    `default-src 'self'; style-src-attr 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval'; script-src-elem 'self' 'nonce-${nonce}'; worker-src 'self' blob:; img-src 'self' data: ` +
      (import.meta.env.DEV ? "" : ""),
  );
  responseHeaders.set("cross-origin-embedder-policy", "require-corp");
  responseHeaders.set("cross-origin-opener-policy", "same-origin");
  responseHeaders.set("cross-origin-resource-policy", "same-site");

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
