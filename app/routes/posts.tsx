import { Link } from "remix";
import posts from "../data.json" assert { type: "json" };

import { dateFormat } from "../utils/dateFormat.js";

export default function Posts() {
  return (
    posts.map(post => {
      const published = new Date(post.commits[0].date);
      // @ts-ignore
      // const updated = new Date(post.commits.at(-1)?.date);
      return (
        <article key={post.slug} className="p-2">
          <h2 className="">
            <Link to={`/post/${post.slug}`} className="">{post.title}</Link>
          </h2>
          <p>
            {post.description}
          </p>
          <p>
            <small>发布于{dateFormat.format(published)}</small>
          </p>
        </article>
      );
    }
    )
  );
}
