import type {
  DataRouter,
  unstable_RSCPayload as RSCPayload,
} from "react-router";

import {
  createFromReadableStream,
  createTemporaryReferenceSet,
  encodeReply,
  setServerCallback,
} from "@vitejs/plugin-rsc/browser";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import {
  unstable_createCallServer as createCallServer,
  unstable_getRSCStream as getRSCStream,
  unstable_RSCHydratedRouter as RSCHydratedRouter,
} from "react-router";

setServerCallback(
  createCallServer({
    createFromReadableStream,
    createTemporaryReferenceSet,
    encodeReply,
  }),
);

createFromReadableStream<RSCPayload>(getRSCStream()).then(
  (payload: RSCPayload) => {
    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <RSCHydratedRouter
            payload={payload}
            createFromReadableStream={createFromReadableStream}
          />
        </StrictMode>,
      );
    });
  },
);

/**
 * @see https://github.com/vitejs/vite-plugin-react/pull/763/files
 */
if (import.meta.hot) {
  import.meta.hot.on("rsc:update", () => {
    (window as unknown as { __router: DataRouter }).__router.revalidate();
  });
}
