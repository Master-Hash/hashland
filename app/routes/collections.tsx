import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return {
    title: "专栏 « Hashland",
    "og:title": "专栏 « Hashland",
    "og:description": "（）",
    description: "（）",
  };
};

export default function Collections() {
  return (
    <article className="prose dark:prose-invert">
      <h1>专栏</h1>
      <p>施工中</p>
    </article>
  );
}
