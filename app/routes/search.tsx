import type { LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";

export const loader: LoaderFunction = async ({ request }) => {
  const reqUrl = new URL(request.url);
  const searchTerms = reqUrl.searchParams.get("q");
  if (searchTerms) {
    return redirect(`https://github.com/search?q=${searchTerms}+repo%3AMaster-Hash%2Fpost+language%3AMarkdown+path%3Apost&type=Code`);
  }
  else {
    throw new Response("请指定搜索参数。", {
      status: 400,
      statusText: "Bad Request"
    });
  }
};
