import { Link } from "@remix-run/react";
// import type { MetaFunction } from "@remix-run/cloudflare";
// import posts from "../data.json" assert { type: "json" };

// import { dateFormat } from "../utils/dateFormat.js";

// export const meta: MetaFunction = () => {
//   return {
//     title: "最新文章 « Hashland",
//     "og:title": "最新文章 « Hashland",
//     "og:description": "Hash 的最新文章",
//     description: "Hash 的最新文章",
//   };
// };

export default function Posts() {
  return (
    <>
      <h1 className="my-6">最新文章</h1>
      {posts.map(post => {
        const published = new Date(post.commits[0].date);
        // @ts-ignore
        // const updated = new Date(post.commits.at(-1)?.date);
        return (
          <Link to={`/post/${post.slug}`} key={post.slug} className="">
            <article className="my-2 -mx-2 p-2 sm:-mx-4 sm:p-4 hover:shadow-2xl hover:bg-zinc-100 dark:hover:bg-zinc-700 sm:hover:bg-zinc-50 dark:sm:hover:bg-zinc-700 sm:hover:shadow-xl">
              <h2 className="text-xl my-1">
                {post.title}
              </h2>
              <p>
                {post.description}
              </p>
              <p>
                <small>发布于{dateFormat.format(published)}</small>
              </p>
            </article>
          </Link>
        );
      }
      )}
    </>
  );
}
