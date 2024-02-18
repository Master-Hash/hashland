import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { Suspense, lazy } from "react";

const m = import.meta.glob([
  "/post-test/人/*.md",
  "/post-test/事/*.md",
  "/post-test/物/*.md",
  "/post-test/情思/*.md",
]);

export const loader = (async ({ params }) => {
  const filePath = params["*"]!;

  if (!(`/post-test/${filePath}` in m)) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  const _t = filePath.match(/(人|事|物|情思)\/(.+)\.md/) as Array<string>;
  const { [1]: type, [2]: slug } = _t;

  return json({ filePath, type, slug });
}) satisfies LoaderFunction;

export default function Post() {
  const { type, slug, filePath } = useLoaderData<typeof loader>();
  const L = lazy(m[`/post-test/${filePath}`]);
  return (
    <Suspense fallback="">
      <L
        components={{
          a({ href, children, ...props }) {
            if (URL.canParse(href)) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              );
            } else if (href.endsWith(".md") && !href.includes("/")) {
              // 相同类型
              return (
                <Link to={`../${type}/${href}`} {...props}>
                  {children}
                </Link>
              );
            } else {
              // 不同类型
              return (
                <Link to={href} {...props}>
                  {children}
                </Link>
              );
            }
          },
        }}
      />
    </Suspense>
  );
}
