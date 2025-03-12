import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";

import { NonceContext } from "./utils/components.tsx";

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
  /**
   * @todo When Workers Assets is enabled, I'll create a zip "shiwake" boom
   */
  const body = await renderToReadableStream(
    <NonceContext value={nonce}>
      <ServerRouter context={routerContext} url={request.url} nonce={nonce} />
    </NonceContext>,
    {
      // signal: request.signal,
      onError(error: unknown) {
        // Log streaming rendering errors from inside the shell
        console.error(error);
        responseStatusCode = 500;
      },
      nonce,
    },
  );

  if (import.meta.env.PROD) {
    const userAgent = request.headers.get("user-agent");
    if (userAgent && isbot(userAgent)) {
      // console.warn("user-agent is bot", userAgent);
      await body.allReady;
    }
    // else {
    //   console.info("user-agent is not bot", userAgent);
    // }
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
    `default-src 'self'; style-src-attr 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval'; script-src-elem 'self' 'nonce-${nonce}'${import.meta.env.PROD ? " https://static.cloudflareinsights.com/" : ""}; worker-src 'self' blob:; img-src 'self' data:` +
      (import.meta.env.DEV
        ? "; style-src-elem 'unsafe-inline'"
        : "; connect-src 'self' https://cloudflareinsights.com/"),
  );
  responseHeaders.set("cross-origin-embedder-policy", "require-corp");
  responseHeaders.set("cross-origin-opener-policy", "same-origin");
  responseHeaders.set("cross-origin-resource-policy", "same-site");

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
