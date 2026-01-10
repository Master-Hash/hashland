import { Suspense } from "react";
import { Link } from "waku";

import { Count8Client } from "../components/count8.client.tsx";

export default function Count8() {
  return (
    <main className="prose mx-auto">
      <title>凑8图论演示 « 故人故事故纸堆</title>
      <meta property="og:title" content="凑8图论演示 « 故人故事故纸堆" />
      <h1>凑8图论演示</h1>
      <Suspense
        fallback={
          <p className="h-96 grid place-items-center">正在加载游戏数据……</p>
        }
      >
        <Count8Client />
      </Suspense>
      <p>
        凑8游戏是 <Link to="/人/junyu33.md">Max</Link>{" "}
        初一军训时向我介绍的最爱的游戏，其规则为：开局时，两个人两只手都是1，双方轮流，每轮玩家可以将自己手上的一个数字的值变为该数字和对方手上某个数字的和（只准加，不准加自己），如果超过7，一律变为1，如果为8，则撤手，两只手都撤下为赢。
      </p>
      <p>
        上图为凑8游戏的博弈树。这里正方形表示起始状态，圆表示中间状态，星表示终局状态。边框亮绿表示轮次方大赢，浅绿表示小赢，红色表示小输，粉色表示大输。游戏规则和分析方法参见我和{" "}
        <Link to="/人/junyu33.md">Max</Link> 合作的
        <a
          href="https://blog.junyu33.me/2025/05/23/eights"
          target="_blank"
          rel="noreferrer"
        >
          文章
        </a>
        。
      </p>
      <p>
        如果上图太小，你可能更想看
        <Link to="/count8?c=3">凑3游戏</Link>
        的情况。
      </p>
    </main>
  );
}

// export const getConfig = () => {
//   return {
//     render: "static",
//     // render: "dynamic",
//   } as const;
// };
