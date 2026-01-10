// import { LoaderFunctionArgs, useLoaderData } from "react-router";
import type Feed from "@json-feed-types/1_1";
import type { LoaderFunctionArgs } from "react-router";

import { env } from "cloudflare:workers";
import { Fragment } from "react";
import { Link } from "react-router";

import { dateFormat } from "../../utils/dateFormat.ts";
import { fetchRejectedOnNotOk } from "../../utils/functions.ts";
import { ChannelSection } from "./c.tsx";
// import type Route from "./+types/route.ts";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { TG } = env as { TG: D1Database };
  // Sorry DIYgod, I'll use my own deployment as soon as RSSHub supports Cloudlfare Workers.
  // But you're too slow, so I'll be even more immoral qaq
  const u = new URL(request.url);
  const f = u.searchParams.get("f");

  if (f !== null) {
    const session = TG.withSession("first-unconstrained");
    const statement = session
      .prepare(
        `SELECT id, date, content FROM messages WHERE content IS NOT NULL AND id NOT IN (${"?,".repeat(deleted.length - 1)}?);`,
      )
      .bind(...deleted);
    const rows = (
      await statement.run<{ id: number; date: string; content: string }>()
    ).results;
    return {
      Items: (
        <>
          {rows.map((item, index) => {
            const { id, date, content } = item;
            const d = dateFormat.format(new Date(date));
            return (
              <Fragment key={id}>
                <ChannelSection
                  id={id}
                  content={content}
                  date={d}
                  isHTML={false}
                />
                <hr />
                {/* {index < rows.length - 1 && <hr />} */}
              </Fragment>
            );
          })}
          <p>
            以上是2024年春天至上次存档之间，我公开发表的全部日记。近期尚未存档的日记可以在
            <Link to="/narrative">这里</Link>找到。
          </p>
        </>
      ),
    };
  }
  try {
    const d = await Promise.any([
      fetchRejectedOnNotOk(
        "https://rsshub.app/telegram/channel/hash_elbeszelese?format=json",
      ),
      fetchRejectedOnNotOk(
        "https://rsshub.rssforever.com/telegram/channel/hash_elbeszelese?format=json",
      ),
      fetchRejectedOnNotOk(
        "https://rss-bridge.org/bridge01/?action=display&bridge=TelegramBridge&username=%40hash_elbeszelese&format=Json",
      ),
    ]);
    const data = (await d.json()) as Feed;
    const { items } = data as Feed;
    return {
      Items: (
        <>
          {/* <p>本页只显示最近20条日记，为方便非技术人士阅读而设。</p> */}
          {items
            .toReversed()
            .filter((item) => {
              return !deleted.includes(parseInt(item.url?.split("/").at(-1)!));
            })
            .map((item, index) => {
              const id = item.id.split("/").at(-1);
              const date = dateFormat.format(
                new Date(item.date_published ?? item.date_modified ?? ""),
              );
              return (
                <Fragment key={id}>
                  <ChannelSection
                    id={parseInt(id!)}
                    content={item.content_text ?? item.content_html ?? ""}
                    date={date}
                    isHTML
                  />
                  <hr />
                  {/* {index < items.length - 1 && <hr />} */}
                </Fragment>
              );
            })}
          <p>
            以上是最近20条消息。更早的信息可以在
            <Link to="/narrative?f">这里</Link>找到。
          </p>
        </>
      ),
    };
  } catch {
    throw new Response("Internal Server Error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  // Remix has no server-side caching???
  // Client side is not strict...
  // response.headers.set("Cache-Control", "public, max-age=86400");
};

const deleted = [47, 48, 49, 329];

export default function Narrative({ loaderData }: Route.ComponentProps) {
  const { Items } = loaderData;

  // console.log(Items);
  return (
    <main className="prose prose-a:wrap-break-word relative mx-auto">
      <title>日记 « 故人故事故纸堆</title>

      <meta property="og:title" content="日记 « 故人故事故纸堆" />
      <h1>日记</h1>
      <p>
        发表于{" "}
        <a
          href="https://t.me/s/hash_elbeszelese"
          target="_blank"
          rel="noreferrer"
        >
          Telegram 频道
        </a>
        的日记选段。
      </p>
      <hr />
      {Items}
      {/* <hr /> */}
      <p>
        感谢你看到这里！想必你也是个认真生活的人~ 在 Telegram 里写日记，是朋友
        <Link to="/%E4%BA%BA/Spheniscidae.md">仓鼠</Link>
        给我的灵感。我一直想要一处一有思路即可写下的平台，只是等许多软件打开，思路也就飞走了。而
        Telegram
        上，我随时向朋友吐槽，多到会被反过来吐槽的地步，于是决定讲成故事，写在频道里。在网站上展示频道则受到
        <a href="https://aza.moe/" target="_blank" rel="noreferrer">
          桂桂
        </a>
        启发。早在高一我就见过她的网站，当时见惯了技术博客，她在国外的生活日常让我感到如此新奇有趣。什么是生命中真正重要的呢？我看来，就是这些
        <Link to="/情思/人生的大书.md#故事的意义">讲给自己的故事</Link>
        吧。
      </p>
    </main>
  );
}

export const ErrorBoundary = () => {
  // const error = useRouteError() as {
  //   status: number;
  //   statusText: string;
  //   internal: boolean;
  //   data: string;
  //   error: Error;
  // };
  // console.error(error);
  // useEffect(() => {
  //   console.error(error);
  // });
  return (
    <main className="prose prose-a:break-words relative mx-auto">
      <title>500 Internal Server Error</title>
      <h1>500 Internal Server Error</h1>
      <p>
        因为上游或我们的服务器故障，暂时无法显示内容。请稍后重试或给我写信报修。
      </p>
      <p>
        或者，直接在
        <a
          href="https://t.me/s/hash_elbeszelese"
          target="_blank"
          rel="noreferrer"
        >
          我的 Telegram 频道
        </a>
        里查看正文。
      </p>
    </main>
  );
};
