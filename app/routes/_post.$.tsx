import { HrefToLink } from "../utils/components.tsx";
import type { Route } from "./+types/_post.$.ts";

const m = import.meta.glob([
  "/post-test/人/*.md",
  "/post-test/事/*.md",
  "/post-test/物/*.md",
  "/post-test/情思/*.md",
]);

// const ls = new Map<string, string>();

// for (const key in m) {
//   ls.set(key, lazy(m[key]));
// }

// export const meta: MetaFunction = ({ data }: { data: { slug: string } }) => {
//   return [
//     { title: `${data.slug.split("_").at(-1)} « Hashland` },
//     // { name: "description", content: "Welcome to Remix!" },
//     // 等人工智能来归纳
//   ];
// };

export const loader = ({ params }: Route.LoaderArgs) => {
  const filePath = params["*"];

  if (!(`/post-test/${filePath}` in m)) {
    console.log(filePath);
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  const _t = filePath.match(/(人|事|物|情思)\/(.+)\.md/) as Array<string>;
  const { [1]: type, [2]: slug } = _t;

  return {
    filePath,
    type,
    slug,
    // Markdown: (
    //   <Markdown
    //     components={{
    //       a: HrefToLink,
    //       // img: ImageCloudflareTransform,
    //     }}
    //   />
    // ),
  };
};

export default async function Post({ loaderData }: Route.ComponentProps) {
  // const { type, slug, filePath } = useLoaderData<typeof loader>();
  const { type, slug, filePath } = loaderData;
  const Markdown = await m[`/post-test/${filePath}`]();

  // const Markdown = ls.get(`/post-test/${filePath}`)!;
  // const L = lazy(m[`/post-test/${filePath}`]);

  const t = `${slug.split("_").at(-1)} « 故人故事故纸堆`;
  return (
    <main className="prose mx-auto">
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
      {/* {Markdown({
        components: {
          a: HrefToLink,
        },
      })} */}
    </main>
  );
}
