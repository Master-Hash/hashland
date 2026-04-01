import type { PostItem } from "atom";
import posts from "virtual:recent-posts";

import P from "../docs/homepage.md";

function getSeason(month: number): string {
  if (month >= 3 && month <= 5) return "春";
  if (month >= 6 && month <= 8) return "夏";
  if (month >= 9 && month <= 11) return "秋";
  return "冬";
}

interface PostWithMeta {
  post: (typeof posts)[number];
  season: string;
  year: number;
  month: number;
}

function groupPostsBySeason(posts: PostItem[]): Map<string, PostWithMeta[]> {
  const grouped = Map.groupBy(posts, (post) => {
    const [year, month] = post.commitTime.split("-").map(Number);
    return `${year}-${getSeason(month)}`;
  });

  const result = new Map<string, PostWithMeta[]>();
  for (const [key, items] of grouped) {
    const [year, season] = key.split("-");
    result.set(
      key,
      items.map((post) => ({
        post,
        season,
        year: Number(year),
        month: Number(post.commitTime.split("-")[1]),
      })),
    );
  }
  return result;
}

export default function HomePage() {
  const grouped = groupPostsBySeason(posts);
  const sortedKeys = Array.from(grouped.keys()).sort().reverse();

  return (
    <main className="relative mx-auto prose prose-a:whitespace-nowrap">
      <title>~ « 故人故事故纸堆</title>
      <meta property="og:title" content="~ « 故人故事故纸堆" />
      <P key="homepage" />
      {/* <strong className="text-cat-subtext1">
        ‼ 如你所见，站点尚未完工，正文尤其有待补档。请耐心等待，谢谢！q(≧▽≦q)
      </strong> */}
      <h3>
        最近发表
        {/* <a className="icon-[ph--rss]" href="/atom.xml" download /> */}
      </h3>

      <div>
        <table className="w-full border-collapse">
          <tbody>
            {sortedKeys.map((key) => {
              const items = grouped.get(key)!;
              const [year, season] = key.split("-");

              return items.map((item, idx) => (
                <tr
                  key={`${key}-${idx}`}
                  className="border-t border-cat-surface0"
                >
                  {idx === 0 && (
                    <td
                      rowSpan={items.length}
                      className="w-16 px-4 py-2 align-top font-semibold whitespace-nowrap"
                      valign="top"
                    >
                      {/* <div className="text-cat-subtext1">{year}</div> */}
                      <div className="text-4xl font-bold text-cat-subtext1 select-none">
                        {season}
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-2.5 text-base">
                    <a href={item.post.url} className="text-cat-blue">
                      <strong>{item.post.title}</strong>
                    </a>
                    {item.post.description && (
                      <span>
                        <small className="text-cat-subtext1">
                          ：{item.post.description}
                        </small>
                      </span>
                    )}
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export const getConfig = () => {
  return {
    render: "static",
    // render: "dynamic",
  } as const;
};
