import { Suspense, lazy } from "react";
import type { MetaFunction } from "react-router";
import { HrefToLink } from "../utils/components.tsx";
import type { Route } from "./+types/_post.$.ts";

const m = import.meta.glob([
  "/post-test/人/*.md",
  "/post-test/事/*.md",
  "/post-test/物/*.md",
  "/post-test/情思/*.md",
]);

const ls = new Map<string, string>();

for (const key in m) {
  ls.set(key, lazy(m[key]));
}

export const meta: MetaFunction = ({ data }: { data: { slug: string } }) => {
  return [
    { title: `${data.slug.split("_").at(-1)} « Hashland` },
    // { name: "description", content: "Welcome to Remix!" },
    // 等人工智能来归纳
  ];
};

export const loader = ({ params }: Route.LoaderArgs) => {
  const filePath = params["*"];

  if (!(`/post-test/${filePath}` in m)) {
    console.log(filePath);
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  const _t = filePath.match(/(人|事|物|情思)\/(.+)\.md/) as Array<string>;
  const { [1]: type, [2]: slug } = _t;

  // const module = await m[`/post-test/${filePath}`]();
  // const Markdown = module.default;

  return {
    filePath,
    type,
    slug,
    // Markdown: <Cop />
  };
};

export default function Post({ loaderData }: Route.ComponentProps) {
  // const { type, slug, filePath } = useLoaderData<typeof loader>();
  const { type, slug, filePath } = loaderData;
  const Markdown = ls.get(`/post-test/${filePath}`)!;
  // const L = lazy(m[`/post-test/${filePath}`]);
  return (
    <Suspense fallback="">
      <Markdown
        components={{
          a: HrefToLink,
          // img: ImageCloudflareTransform,
        }}
      />
    </Suspense>
  );
}
