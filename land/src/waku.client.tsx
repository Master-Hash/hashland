/**
 * @see https://github.com/wakujs/waku/blob/main/packages/waku/src/lib/utils/managed.ts
 * @see https://github.com/wakujs/waku/blob/main/docs/create-pages.mdx
 */

import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { Router } from "waku/router/client";

import { isSafari } from "./utils/functions.ts";

const rootElement = (
  <StrictMode>
    <Router />
  </StrictMode>
);

if (!isSafari()) {
  if (globalThis.__WAKU_HYDRATE__) {
    hydrateRoot(document, rootElement);
  } else {
    createRoot(document).render(rootElement);
  }
}
