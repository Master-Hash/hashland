import type { MiddlewareHandler } from "hono";

import { createMiddleware } from "hono/factory";
import { NONCE, secureHeaders } from "hono/secure-headers";
import { unstable_getContext as getContext } from "waku/server";

export const nonceMiddleware = (): MiddlewareHandler => {
  const secure = secureHeaders({
    crossOriginResourcePolicy: "same-site",
    crossOriginEmbedderPolicy: "require-corp",
    crossOriginOpenerPolicy: "same-origin",
    referrerPolicy: "strict-origin-when-cross-origin",
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      scriptSrcAttr: ["'none'"],
      scriptSrcElem: [
        "'self'",
        NONCE,
        ...(import.meta.env.DEV ? [] : ["https://app.rybbit.io/"]),
      ],
      workerSrc: ["'self'", "blob:"],
      imgSrc: ["'self'", "data:"],
      ...(import.meta.env.DEV
        ? {}
        : {
            connectSrc: ["'self'", "https://app.rybbit.io/"],
          }),
    },
  });

  return createMiddleware(async (c, next) => {
    await secure(c, async () => {
      const nonce = c.get("secureHeadersNonce");
      if (nonce) {
        const context = getContext();
        context.nonce = nonce;
      }
      await next();
    });
  });
};
