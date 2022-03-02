import type { LoaderFunction } from "remix";
import { Feed } from "feed";
import { SITEURL } from "../utils/constant.js";
import posts from "../data.json" assert { type: "json" };

const feed = new Feed({
  title: "Hashland",
  description: "文章合集",
  id: `${SITEURL}/`,
  copyright: "公共领域",
  favicon: `${SITEURL}/favicon.svg`,
});

posts.forEach((post) => {
  feed.addItem({
    published: new Date(post.commits[0].date),
    link: `${SITEURL}/post/${post.slug}`,
    title: post.title,
    author: [...new Set(post.commits
      .map(commit => commit.author))
    ].map(author => {
      return { name: author };
    }),
    image: post.image,
    content: post.content,
    description: post.description,
    // date: new Date(post.commits.at(-1).date),
    date: new Date(post.commits[post.commits.length - 1].date),
  });
});

/**
 * @todo 使用 xslt 美化
 */
export const loader: LoaderFunction = ({ request }) => {
  // 很抱歉不知道怎么判断别的……
  // const isOutlook = request.headers.get("User-Agent") == "Mozilla/4.0 (compatible; ms-office; MSOffice 16)";
  // return new Response(isOutlook
  //   ? feed.atom1()
  //   : feed.atom1()
  //     .replace("\n", '\n<?xml-stylesheet type="application/xslt+xml" href="atom.xslt"?>\n')
  //   , {
  //     status: 200,
  //     headers: {
  //       "Content-Type": isOutlook ? "application/atom+xml" : "application/xml",
  //     }
  //   });
  return new Response(feed.atom1(), {
    status: 200,
    headers: {
      "Content-Type": "application/atom+xml",
      // "Content-Type": "application/xml", // for debug
    },
  });
};