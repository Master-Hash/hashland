import { env } from "cloudflare:workers";

export const GET = async (request: Request): Promise<Response> => {
  const u = new URL(request.url);
  if (request.headers.get("Accept")?.includes("image/svg+xml")) {
    u.pathname = "/favicon.svg";
    const s = env.ASSETS.fetch(u);
    return s;
  } else {
    u.pathname = "/_favicon.ico";
    const i = env.ASSETS.fetch(u);
    return i;
  }
};
