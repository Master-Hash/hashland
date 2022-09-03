import { json } from "@remix-run/cloudflare";
import type { SerializeFrom } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import * as TinySnowScript from "./post/Tiny_Snow-script.md";

type PostModule = typeof TinySnowScript;
type PostMeta = { slug: string; title: string; type: string; };

function postFromModule(item: PostModule): PostMeta {
  return {
    slug: item.filename.replace(/\.mdx?$/, ""),
    ...item.attributes.meta,
  };
}

export const loader = () => {
  return json([
    postFromModule(TinySnowScript),
  ]);
};

// export const meta: MetaFunction = () => {
//   return {
//     title: "最新文章 « Hashland",
//     "og:title": "最新文章 « Hashland",
//     "og:description": "Hash 的最新文章",
//     description: "Hash 的最新文章",
//   };
// };

export default function Posts() {
  const posts = useLoaderData<SerializeFrom<typeof loader>>();
  return (
    <></>
  );
}
