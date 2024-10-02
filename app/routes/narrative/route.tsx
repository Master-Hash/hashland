// import { LoaderFunctionArgs, useLoaderData } from "react-router";
import type Feed from "@json-feed-types/1_1";
import { Suspense } from "react";
import type { MetaFunction } from "react-router";
import { Await, Link, useLoaderData } from "react-router";
import { dateFormat } from "../../utils/dateFormat.js";
import { fetchRejectedOnNotOk } from "../../utils/functions.js";

export const meta: MetaFunction = () => {
  return [
    { title: `日记 « 故人故事故纸堆` },
    // { name: "description", content: "Welcome to Remix!" },
    // 等人工智能来归纳
  ];
};

export const loader = async () => {
  // Sorry DIYgod, I'll use my own deployment as soon as RSSHub supports Cloudlfare Workers.
  // But you're too slow, so I'll be even more immoral qaq
  try {
    const d = await Promise.any([
      fetchRejectedOnNotOk(
        "https://rsshub.app/telegram/channel/hash_elbeszelese?format=json",
      ),
      fetchRejectedOnNotOk(
        "https://rsshub.rssforever.com/telegram/channel/hash_elbeszelese?format=json",
      ),
    ]);
    return { data: d.json() };
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

const deleted = [47, 48, 49];

export default function Narrative() {
  const { data } = useLoaderData() as { data: Promise<Feed> };
  return (
    <main className="prose relative mx-auto prose-a:break-words">
      <h1>日记</h1>
      <Suspense fallback="">
        <Await resolve={data}>
          {({ items, description }: Feed) => {
            return (
              <>
                <p>{description?.split("-").at(0)}</p>
                <hr />
                {items.toReversed().map((item, index) => {
                  const id = item.id.split("/").at(-1);
                  const date = dateFormat.format(
                    new Date(item.date_published!),
                  );
                  return (
                    !deleted.includes(Number(id)) && (
                      <section id={id}>
                        <p
                          key={id}
                          // When RSC is ready, I'll abandon dangerouslySetInnerHTML!
                          // And I'll rewrite insite links!
                          dangerouslySetInnerHTML={{
                            __html: item.content_html!,
                          }}
                        />
                        <p className="text-right text-cat-subtext1">
                          <small>
                            {date}・
                            <a href={item.url} target="_blank" rel="noreferrer">
                              #{id}
                            </a>
                          </small>
                        </p>
                        {/* <hr /> */}
                        {index < items.length - 1 && <hr />}
                      </section>
                    )
                  );
                })}
              </>
            );
          }}
        </Await>
      </Suspense>
      <hr />
      <p className="text-cat-subtext1">
        感谢你看到这里！想必你也是个认真生活的人~
      </p>
      <p className="text-cat-subtext1">
        如你所见，这里是
        <a
          href="https://t.me/s/hash_elbeszelese"
          target="_blank"
          rel="noreferrer"
        >
          我的 Telegram 频道
        </a>
        的一小部分，更早的内容可以在其中找到。在 Telegram 里写日记，是朋友
        <Link to="/post/%E4%BA%BA/Spheniscidae.md">仓鼠</Link>
        给我的灵感。我一直想要一处一有思路即可写下的平台，只是等许多软件打开，思路也就飞走了。而
        Telegram
        上，我随时向朋友吐槽，多到会被反过来吐槽的地步，于是决定讲成故事，写在频道里。在网站上展示频道则受到
        <a href="https://aza.moe/" target="_blank" rel="noreferrer">
          桂桂
        </a>
        启发。早在高一我就见过她的网站，当时见惯了技术博客，她在国外的生活日常让我感到如此新奇有趣。什么是生命中真正重要的呢？我看来，就是这些
        <Link to="/post/情思/人生的大书.md#故事的意义">讲给自己的故事</Link>
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
    <>
      <title>500 Internal Server Error</title>
      <main className="prose relative mx-auto prose-a:break-words">
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
    </>
  );
};
