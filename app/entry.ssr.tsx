import { createFromReadableStream } from "@vitejs/plugin-rsc/ssr";
import { Resend } from "resend";
// @ts-ignore
import { renderToReadableStream } from "react-dom/server.edge";
import {
  unstable_RSCStaticRouter as RSCStaticRouter,
  unstable_routeRSCServerRequest as routeRSCServerRequest,
} from "react-router";
import { NonceContext } from "./nonce.client.tsx";
import { dateFormatShanghai } from "./utils/dateFormat.ts";

export default {
  async fetch(request, { SERVER, ASSETS, DAILY_VIEWER }, ctx) {
    const u = new URL(request.url);
    if (u.pathname === "/favicon.ico") {
      if (request.headers.get("Accept")?.includes("image/svg+xml")) {
        u.pathname = "/favicon.svg";
        const s = ASSETS.fetch(u);
        return s;
      } else {
        u.pathname = "/_favicon.ico";
        const i = ASSETS.fetch(u);
        return i;
      }
    }

    if (u.pathname === "/count" && request.method === "POST") {
      // Proxy to GoatCounter
      u.hostname = "hash.goatcounter.com";
      u.pathname = "/count";
      return fetch(new Request(u, request));
    }

    const callServer = (request: Request) => SERVER.fetch(request);
    const data = logToKV(request);
    ctx.waitUntil(
      DAILY_VIEWER.put(data.ray.slice(0, -4), JSON.stringify(data), {
        expirationTtl: 60 * 60 * 24 + 600, // 1 day + 10 minutes
      }),
    );
    return handler(request, callServer);
  },
  // copy from https://github.com/84634E1A607A/Blog/blob/master/src/index.js
  async scheduled(event, env, ctx) {
    const logs = [] as Array<ReturnType<typeof logToKV>>;
    let cursor;
    for (;;) {
      const list = (await env.DAILY_VIEWER.list({
        cursor: cursor,
      })) as KVNamespaceListResult<unknown, string>;
      for (const key of list.keys) {
        const value = await env.DAILY_VIEWER.get(key.name);
        if (value) logs.push(JSON.parse(value));
      }
      cursor = list.cursor;
      if (list.list_complete) {
        break;
      }
    }

    if (logs.length === 0) return;
    // from latest to oldest
    logs.sort((a, b) => b.timestamp - a.timestamp);
    console.log(logs);
    // Send email via Resend
    const rows = logs.map((log) => {
      const formattedDate = dateFormatShanghai.format(new Date(log.timestamp));
      return (
        <tr>
          <td className="table-cell">{formattedDate}</td>
          <td className="table-cell">{log.url}</td>
          <td className="table-cell">{log.referer}</td>
          <td className="table-cell">{log.ip}</td>
          <td className="table-cell">{log.city}</td>
          <td className="table-cell">{log.as}</td>
          <td className="table-cell">{log.ua}</td>
        </tr>
      );
    });

    const resend = new Resend(env.RESEND_API_KEY);

    ctx.waitUntil(
      resend.emails.send({
        from: "Blog Worker <notifications@hash.moe>",
        to: "hash <hash@hash.moe>",
        subject: `Blog Views Report - ${new Date().toISOString().split("T")[0]}`,
        react: (
          <html>
            <head>
              <style>
                {`.table-cell{border:1px solid #ddd;padding:6px}.table{border-collapse:collapse;width:100%}`}
              </style>
            </head>
            <body>
              <p>Daily blog views report:</p>
              <table className="table">
                <thead>
                  <tr>
                    <th className="table-cell">Time</th>
                    <th className="table-cell">URL</th>
                    <th className="table-cell">Referer</th>
                    <th className="table-cell">IP</th>
                    <th className="table-cell">City</th>
                    <th className="table-cell">Autonomous System</th>
                    <th className="table-cell">User Agent</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </table>
            </body>
          </html>
        ),
      }),
    );
  },
} satisfies ExportedHandler<Env>;

async function handler(
  request: Request,
  callServer: (request: Request) => Promise<Response>,
) {
  const nonce = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
  );
  const h: HeadersInit = new Headers();
  h.set(
    "content-security-policy",
    `default-src 'self'; script-src 'self' 'unsafe-eval'; script-src-elem 'self' 'nonce-${nonce}'; worker-src 'self' blob:; img-src 'self' data:` +
      (import.meta.env.DEV
        ? "; style-src-elem 'self' 'unsafe-inline'"
        : "; connect-src 'self'"),
  );
  const bootstrapScriptContent =
    await import.meta.viteRsc.loadBootstrapScriptContent("index");
  return routeRSCServerRequest({
    request,
    fetchServer: callServer,
    createFromReadableStream,
    renderHTML(getPayload) {
      return renderToReadableStream(
        <NonceContext value={nonce}>
          <RSCStaticRouter getPayload={getPayload} nonce={nonce} />
        </NonceContext>,
        {
          // bootstrapModules: new URL(request.url).searchParams.has("__nojs")
          // ? []
          // : getAssetsManifest().entry.bootstrapModules,
          bootstrapScriptContent,
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

function logToKV(request: Request) {
  const ray = request.headers.get("cf-ray") || "";
  const data = {
    timestamp: Date.now(),
    url: decodeURI(request.url),
    referer: request.headers.get("referer") || "",
    method: request.method,
    ray: ray,
    ip:
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      "",
    host: request.headers.get("host") || "",
    as: `AS${request.cf?.asn} ${request.cf?.asOrganization}`,
    ua: request.headers.get("user-agent") || "",
    cc: request.headers.get("Cf-Ipcountry") || "",
    city: request.headers.get("Cf-ipcity") || "",
    colo: request.cf?.colo,
  };

  console.log(data);
  return data;
}
