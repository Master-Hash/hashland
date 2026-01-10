import { env } from "cloudflare:workers";
import { Fragment, Suspense } from "react";

async function SlowComponent() {
  const { DB } = env;
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  const workerdStartTime = new Date().valueOf() / 1000;
  const statement = DB.prepare("SELECT unixepoch('subsec')");
  const _res = await statement.run();
  const res = _res.results[0]["unixepoch('subsec')"] as number;
  const workerdEndTime = new Date().valueOf() / 1000;
  const delta1 = res - workerdStartTime,
    delta2 = workerdEndTime - res;
  return (
    <ul>
      <li>{workerdStartTime}：WorkerD 开始时间</li>
      <li>
        {res}：D1返回的第一个时间戳 （{delta1 > 0 ? "+" : ""}
        {delta1}ms）
      </li>
      <li>
        {workerdEndTime}：WorkerD 结束时间（{delta2 > 0 ? "+" : ""}
        {delta2}ms）
      </li>
    </ul>
  );
}

export default async function LantencyMetaPage() {
  return (
    <Fragment key="meta">
      <title>D1延迟测试meta « 故人故事故纸堆</title>
      <meta property="og:title" content="D1延迟测试meta « 故人故事故纸堆" />
      <h1>D1延迟测试meta</h1>
      <Suspense fallback={<div>正在读取数据库</div>}>
        <SlowComponent />
      </Suspense>
    </Fragment>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
