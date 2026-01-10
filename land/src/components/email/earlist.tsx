"use client";

import { useEffect } from "react";

import { useTime } from "../../utils/hooks.ts";

export function Earlist({
  earistThreadTime,
}: {
  earistThreadTime: number | null;
}) {
  const time = Math.floor(useTime().valueOf() / 1000);
  // 类型推断一团糟
  const delta = earistThreadTime ? earistThreadTime - time + 37 * 60 : null;
  useEffect(() => {
    // console.log(delta);
    if (earistThreadTime && delta && delta < 0 && delta > -36000) {
      window.navigation.reload();
    }
  });
  const s = delta ? delta % 60 : null,
    m = delta && s ? (delta - s) / 60 : null;

  return (
    <>
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
    </>
  );
}
