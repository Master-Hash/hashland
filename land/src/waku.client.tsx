/**
 * @see https://github.com/wakujs/waku/blob/main/packages/waku/src/lib/utils/managed.ts
 * @see https://github.com/wakujs/waku/blob/main/docs/create-pages.mdx
 */

import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { unstable_defaultRootOptions as defaultRootOptions } from "waku/client";
import { Router } from "waku/router/client";

const rootElement = (
  <StrictMode>
    <Router />
  </StrictMode>
);

if (globalThis.__WAKU_HYDRATE__) {
  hydrateRoot(document, rootElement, defaultRootOptions);
} else {
  createRoot(document, defaultRootOptions).render(rootElement);
}
