import { createMiddleware } from "hono/factory";

/**
 * @deprecated I patched waku to generate nonce when `renderToReadableStream`
 */
const _nonceGenerator = () =>
  createMiddleware(async (c, next) => {
    await next();

    // run only for HTML responses
    const contentType = c.res.headers.get("Content-Type") || "";
    if (!contentType.includes("text/html")) {
      return;
    }

    // todo: use Uint8Array.toBase64()
    // Cloudflare Workers supports it, but Node.js 24 doesn't yet
    const uint8Array = crypto.getRandomValues(new Uint8Array(16));
    const nonce = import.meta.env.PROD
      ? (uint8Array as any).toBase64()
      : Array.from(uint8Array)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

    const cspValue =
      `default-src 'self'; script-src 'self' 'unsafe-eval'; script-src-elem 'self' 'nonce-${nonce}'; worker-src 'self' blob:; img-src 'self' data:` +
      (import.meta.env.DEV
        ? "; style-src-elem 'self' 'unsafe-inline'"
        : "; connect-src 'self' https://app.rybbit.io/");

    // modify the HTML to include the nonce in script tags
    // streaming response
    const newBody = c.res.body;
    const newContent = newBody?.pipeThrough(
      new TransformStream({
        async transform(chunk, controller) {
          const text = new TextDecoder().decode(chunk);
          const newText = text.replace(
            /<script( id="_R_")?>/g,
            `<script$1 nonce="${nonce}">`,
          );
          controller.enqueue(new TextEncoder().encode(newText));
        },
      }),
    );

    c.res = new Response(newContent, {
      status: c.res.status,
      statusText: c.res.statusText,
      headers: c.res.headers,
    });

    c.res.headers.set("Content-Security-Policy", cspValue);
  });

export const nonceExtractor = () =>
  createMiddleware(async (c, next) => {
    await next();

    // if is not text/html response, return
    if (c.res.headers.get("Content-Type")?.includes("text/html") !== true) {
      return;
    }

    // read csp from response headers
    const csp = c.res.headers.get("Content-Security-Policy");
    // console.log(csp);
    if (!csp) {
      throw new Error("CSP header is missing");
    }

    // read nonce-${value}
    const nonceMatch = csp.match(/nonce-([^;'"]+)/);
    if (!nonceMatch) {
      throw new Error("CSP header is missing");
    }
    const nonce = nonceMatch[1];

    c.res.headers.set(
      "content-security-policy",
      `default-src 'self'; script-src 'self' 'unsafe-eval'; script-src-attr 'none'; script-src-elem 'self' 'nonce-${nonce}'${import.meta.env.DEV ? "" : " https://app.rybbit.io/"}; worker-src 'self' blob:; img-src 'self' data:` +
        (import.meta.env.DEV
          ? ""
          : "; connect-src 'self' https://app.rybbit.io/"),
    );

    // https://hono.dev/docs/middleware/builtin/secure-headers
    c.res.headers.set("cross-origin-resource-policy", "same-site");
    c.res.headers.set("cross-origin-embedder-policy", "require-corp");
    c.res.headers.set("cross-origin-opener-policy", "same-origin");
    c.res.headers.set("origin-agent-cluster", "?1");
    c.res.headers.set("x-content-type-options", "nosniff");
    c.res.headers.set("x-dns-prefetch-control", "off");
    c.res.headers.set("x-download-options", "noopen");
    c.res.headers.set("x-frame-options", "SAMEORIGIN");
    c.res.headers.set("x-permitted-cross-domain-policies", "none");
    c.res.headers.set("x-xss-protection", "0");
  });

export default nonceExtractor;
