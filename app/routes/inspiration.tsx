import { json, } from "@remix-run/cloudflare";
import type { SerializeFrom } from "@remix-run/cloudflare";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import * as TinySnowScript from "./inspiration/opinions/Tiny_Snow-script.md";

type PostModule = typeof TinySnowScript;
type PostMeta = { slug: string; title: string; };

function postFromModule(item: PostModule): PostMeta {
  return {
    slug: item.filename.replace(/\.mdx?$/, ""),
    ...item.attributes.meta,
  };
}

export const loader = () => {
  return json({
    opinions: [
      postFromModule(TinySnowScript),
    ],
    feelings: [],
    habits: [],
  });
};

export default function Inspiration() {
  const { feelings, habits, opinions } = useLoaderData<SerializeFrom<typeof loader>>();
  return <main className="flex flex-grow dark:text-white mx-auto prose dark:prose-invert">
    <Outlet />
  </main>;
}