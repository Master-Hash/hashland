import type { MiddlewareHandler } from "hono";
import { contextStorage } from "hono/context-storage";
import { createMiddleware } from "hono/factory";
import { NONCE, secureHeaders } from "hono/secure-headers";

export const nonceMiddleware = (): MiddlewareHandler => {
  const storage = contextStorage();
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
    // run only for HTML responses
    const contentType = c.req.raw.headers.get("Accept") || "";
    if (import.meta.env.PROD && !contentType.includes("text/html")) {
      await next();
      return;
    }
    await storage(c, async () => {
      await secure(c, next);
    });
  });
};
