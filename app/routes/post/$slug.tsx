import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import posts from "../../data.json" assert { type: "json" };
import { dateFormat } from "../../utils/dateFormat.js";
import type { Post } from "../../utils/type.js";
import { Comment } from "../../utils/comment.js";

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
    <>
      <article
        className="mx-auto prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <hr className="my-8" />
      <div className="mx-auto prose dark:prose-invert">
        <h3 className="">编辑记录</h3>
        <ul>
          {post.commits.map(commit =>
            <li key={commit.hash}>
              <p>{commit.message}</p>
              <p>
                <small>
                  {commit.author}・{dateFormat.format(new Date(commit.date))}・
                  <a href={`https://github.com/Master-Hash/post/commit/${commit.fullHash}`} target="_blank" rel="noreferrer" className="underline">
                    {commit.hash}
                  </a>
                </small>
              </p>
            </li>
          )}
        </ul>
      </div>
      <div className="print:hidden">
        <hr className="my-8" />
        <Comment />
      </div>
    </>
  );
}
