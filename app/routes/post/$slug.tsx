import { useLoaderData } from "remix";
import type { MetaFunction, LoaderFunction } from "remix";
import posts from "../../data.json" assert { type: "json" };
import type { Post } from "../../utils/type.js";

export const meta: MetaFunction = ({ data }: { data: Post; }) => {
  return {
    title: `${data.title} « Hashland`,
    "og:title": `${data.title} « Hashland`,
    "og:description": `${data.description}`,
    description: `${data.description}`,
  };
};

export const loader: LoaderFunction = ({ params }) => {
  const _ps = groupBy(posts, ({ slug }) => slug);
  if (params.slug && params.slug in _ps) { return _ps[params.slug][0]; }
  else {
    throw new Response("Not Found", {
      status: 404,
      statusText: "Not Found",
    });
  }
};
/**
 * @see https://stackoverflow.com/questions/42136098/array-groupby-in-typescript
 */
const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);

/**
 * @todo 等 groupBy 方法出来更新
 */
export default function PostSlug() {
  const post = useLoaderData<Post>();

  return (
    <article
      className="mx-auto prose prose-blockquote:not-italic"
      dangerouslySetInnerHTML={{ __html: post.content }}
    />
  );
}
