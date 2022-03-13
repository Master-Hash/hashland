import { useLoaderData } from "remix";
import type { LoaderFunction, MetaFunction, } from "remix";

export const loader: LoaderFunction = async ({ request }) => {
  const reqUrl = new URL(request.url);
  const searchString = reqUrl.searchParams.get("q");
  if (searchString) {
    const u = new URL("https://api.github.com/search/code");
    u.searchParams.append("per_page", "6");
    u.searchParams.append("q", `${searchString} path:post in:file language:markdown repo:Master-Hash/post`);
    // 这不标准，URL 明明可以是参数
    const res = await fetch(u.href, {
      headers: {
        "Accept": "application/vnd.github.v3.text-match+json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
      }
    });
    // API doc https://docs.github.com/cn/rest/reference/search#%E6%96%87%E6%9C%AC%E5%8C%B9%E9%85%8D%E5%85%83%E6%95%B0%E6%8D%AE
    return await res.json();
  }
  else {
    throw new Response("请指定搜索参数。", {
      status: 400,
      statusText: "Bad Request"
    });
  }
};

export const meta: MetaFunction = () => {
  return {
    title: "搜索 « Hashland",
    "og:title": "搜索 « Hashland",
    "og:description": "搜索文章内容",
    description: "搜索文章内容",
  };
};

type SearchResult = {
  total_count: number;
  incomplete_results: boolean;
  items: Item[];
};

type Item = {
  name: string;
  path: string;
  sha: string;
  url: string;
  git_url: string;
  html_url: string;
  repository: Object;
  score: number;
  text_matches: TextMatch[];
};

type TextMatch = {
  "object_url": string,
  "object_type": string,
  "property": string,
  "fragment": string,
  "matches": {
    "text": string,
    "indices": [number, number];
  }[],
};

export default function SearchComponent() {
  const res = useLoaderData<SearchResult>();
  return (
    <>
      <h1 className="font-bold text-4xl">搜索</h1>
      <ul className="">
        {res.items.map((item: Item) =>
          <li key={item.sha}>
            <h2>{item.name}</h2>
            <pre>
              {item.text_matches.map(textMatch =>
                <p key={textMatch.object_url}>
                  {textMatch.fragment
                    .split("\n")
                    .map((line, index) => <p key={index}>
                      {line}
                    </p>)}
                </p>
              )}
            </pre>
          </li>
        )}
      </ul>
    </>
  );
}