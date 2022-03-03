import { Link } from "remix";
import posts from "../data.json" assert { type: "json" };

const dateFormat = new Intl.DateTimeFormat("zh-CN", { dateStyle: "long", });

export default function Posts() {
  return (
    posts.map(post => {
      const published = new Date(post.commits[0].date);
      // @ts-ignore
      const updated = new Date(post.commits.at(-1)?.date);
      return (
        <article key={post.slug}>
          <h2>
            <Link to={`/post/${post.slug}`}>{post.title}</Link>
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
