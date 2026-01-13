import type { PageProps } from "waku/router";

import { HrefToLink } from "../../../utils/components.tsx";

const m = import.meta.glob([
  "/post/人/*.md",
  "/post/事/*.md",
  "/post/物/*.md",
  "/post/情思/*.md",
]);

const entries: Array<[string, string]> = Object.keys(m).map((path) => {
  const match = path.match(/\/post\/([^/]+)\/([^/]+)$/);
  if (!match) throw new Error(`Invalid path: ${path}`);
  const [_, type, post] = match;
  return [type, post];
});

export default async function Post({
  type: _t,
  post: _p,
}: PageProps<"/[type]/[post]">) {
  // console.log(m, entries);
  // console.log("Rendering post:", _t, _p);
  const Markdown = await m[`/post/${_t}/${_p}`]();

  const tSansExtension = _p.replace(/\.md$/, "");
  const title = tSansExtension.split("_").at(-1);

  const t = `${title} « 故人故事故纸堆`;
  return (
    <main className="mx-auto prose">
      <title>{t}</title>
      <meta name="description" content={Markdown.frontmatter.description} />
      <meta property="og:title" content={t} />
      <meta
        property="og:description"
        content={Markdown.frontmatter.description}
      />
      <Markdown.default
        components={{
          a: HrefToLink,
        }}
      />
    </main>
  );
}

export const getConfig = () => {
  return {
    render: "static",
    staticPaths: entries,
  } as const;
};
