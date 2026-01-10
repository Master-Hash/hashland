"use client";

import { useEffect } from "react";

import { Mailbox } from "../../../stories/Mailbox.tsx";
import { HrefToLink } from "../../utils/components.tsx";
import { useTime } from "../../utils/hooks.ts";
import P1 from "./p1.md";
import P2 from "./p2.md";
import P3 from "./p3.md";

export function EmailClient({ loaderData }) {
  "use memo";
  // return "fuck";
  const { inbox, sent, threads, earistThreadTime } = loaderData;
  const time = Math.floor(useTime().valueOf() / 1000);
  // 类型推断一团糟
  const delta = earistThreadTime ? earistThreadTime - time + 37 * 60 : null;
  useEffect(() => {
    // console.log(delta);
    if (earistThreadTime && delta && delta < 0 && delta > -36000) {
      location.reload();
    }
  });
  const s = delta ? delta % 60 : null,
    m = delta && s ? (delta - s) / 60 : null;

  return (
    <main className="prose relative mx-auto">
      <title>电子邮件 « 故人故事故纸堆</title>
      <meta property="og:title" content="电子邮件 « 故人故事故纸堆" />
      {/* <aside className="absolute bottom-0 right-0 text-6xl text-cat-text md:-right-12 md:top-0 lg:-right-24">
        <div className="icon-[fluent-emoji-high-contrast--postbox] -rotate-[9deg]" />
      </aside> */}
      <P1
        components={{
          a: HrefToLink,
        }}
      />
      <h2>收件</h2>
      <Mailbox messages={inbox} />
      <h2>寄件</h2>
      <Mailbox messages={sent} />
      <P2
        components={{
          a: HrefToLink,
        }}
      />
      <Mailbox messages={threads} />
      {/* 这句话，真有信在排队再放上去罢 */}
      {earistThreadTime ? (
        <p>
          邮件会在送达的37分钟后公开展示。如果最近一封是你所发，再过
          <span>
            {/** @todo 用 Intl.??? 尝试重写 */}
            {m != 0 ? `${m}分` : null}
            {s}秒
          </span>
          ，大家就能看到它啦。
        </p>
      ) : (
        <p>邮件会在送达的37分钟后公开展示。暂时还没有新来信~</p>
      )}
      <P3
        components={{
          a: HrefToLink,
        }}
      />
    </main>
  );
}
