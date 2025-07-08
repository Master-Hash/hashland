import {
  createFromReadableStream,
  encodeReply,
  setServerCallback,
} from "@vitejs/plugin-rsc/browser";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import type { unstable_RSCPayload as RSCPayload } from "react-router";
import {
  unstable_createCallServer as createCallServer,
  unstable_getRSCStream as getRSCStream,
  unstable_RSCHydratedRouter as RSCHydratedRouter,
} from "react-router";

setServerCallback(
  createCallServer({
    createFromReadableStream,
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
