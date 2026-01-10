import type { LoaderFunctionArgs } from "react-router";

import { env } from "cloudflare:workers";
import { Fragment } from "react";
import { Link } from "react-router";

import type { Route } from "./+types/d1-lantency.$testid.ts";

export const loader = async ({
  context,
  params,
}: Route.LoaderArgs & LoaderFunctionArgs) => {
  const { DB } = env;
  const workerdStartTime = new Date().valueOf() / 1000;
  const statement = DB.prepare("SELECT unixepoch('subsec')");
  // const statement2 = DB.prepare("SELECT unixepoch()");
  //  console.log("WorkerD Time:", workerdStartTime);
  switch (params.testid) {
    case "meta": {
      const res = await statement.run();
      console.log(res.meta);
      const workerdEndTime = new Date().valueOf() / 1000;
      return {
        workerdStartTime,
        res: res.results[0]["unixepoch('subsec')"],
        workerdEndTime,
        // meta: res.meta,
      };
    }
    case "1": {
      // 典型的查询时间是 0.2ms，可以忽略，我就懒得从 meta 里提取，放前端显示了。
      const res = await statement.first<number>("unixepoch('subsec')");
      console.log(res);
      const workerdEndTime = new Date().valueOf() / 1000;
      return { workerdStartTime, res, workerdEndTime };
    }
    case "2": {
      const res = await statement.first<number>("unixepoch('subsec')");
      const res2 = await statement.first<number>("unixepoch('subsec')");
      console.log(res, res2);
      const workerdEndTime = new Date().valueOf() / 1000;
      return { workerdStartTime, res, res2, workerdEndTime };
    }
    case "3": {
      const res = await DB.batch<{ "unixepoch('subsec')": number }>([
        statement,
        statement,
      ]);
      const [r1, r2] = [
        res[0].results[0]["unixepoch('subsec')"],
        res[1].results[0]["unixepoch('subsec')"],
      ];
      console.log(res[0].meta, res[1].meta);
      const workerdEndTime = new Date().valueOf() / 1000;
      return { workerdStartTime, res: r1, res2: r2, workerdEndTime };
    }
    case "4": {
      const [res, res2] = await Promise.all([
        statement.first<number>("unixepoch('subsec')"),
        statement.first<number>("unixepoch('subsec')"),
      ]);
      console.log(res, res2);
      const workerdEndTime = new Date().valueOf() / 1000;
      return { workerdStartTime, res, res2, workerdEndTime };
    }
    case "5": {
      const session = DB.withSession("first-unconstrained");
      const res = await session.prepare("SELECT unixepoch('subsec')").run();
      const res2 = await session.prepare("SELECT unixepoch('subsec')").run();
      const workerdEndTime = new Date().valueOf() / 1000;
      console.log(session, res.meta, res2.meta);
      return {
        workerdStartTime,
        res: res.results[0]["unixepoch('subsec')"],
        res2: res2.results[0]["unixepoch('subsec')"],
        workerdEndTime,
        // meta: res.meta,
        // meta2: res2.meta,
      };
    }
    default:
      throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }
};

export default function DisplayMailbox({
  loaderData,
  params,
}: Route.ComponentProps) {
  const allTests = [1, 2, 3, 4, 5];
  const delta1 = 1000 * (loaderData.res! - loaderData.workerdStartTime);
  const delta2 = loaderData.res2
    ? 1000 * (loaderData.res2 - loaderData.res!)
    : null;
  const delta3 =
    1000 *
    (loaderData.workerdEndTime -
      (loaderData.res2 ? loaderData.res2 : loaderData.res!));

  return (
    <main className="prose mx-auto">
      <title>D1延迟测试${params.testid} « 故人故事故纸堆</title>
      <meta
        name="og:title"
        content={`D1延迟测试${params.testid} « 故人故事故纸堆`}
      />
      <h1>D1延迟测试{params.testid}</h1>
      <ul>
        <li>{loaderData.workerdStartTime}：WorkerD 开始时间</li>
        <li>
          {loaderData.res}：D1返回的第一个时间戳（{delta1 > 0 ? "+" : ""}
          {delta1}ms）
        </li>
        {loaderData.res2 ? (
          <li>
            {loaderData.res2}：D1返回的第二个时间戳（{delta2! > 0 ? "+" : ""}
            {delta2}ms）
          </li>
        ) : null}
        <li>
          {loaderData.workerdEndTime}：WorkerD 结束时间（
          {delta3 > 0 ? "+" : ""}
          {delta3}
          ms）
        </li>
      </ul>
      <p>
        娱乐测试，仅供参考。应配合F12的
        <a
          href="https://developer.chrome.com/docs/devtools/network/reference?hl=zh-cn#timing"
          target="_blank"
          rel="noopener noreferrer"
        >
          时间细分数据
        </a>
        观测。
      </p>
      <p>
        {allTests
          // .filter((t) => t.toString() !== params.testid)
          .map((serial, index) => {
            return (
              <Fragment key={serial}>
                {serial.toString() !== params.testid ? (
                  <Link to={`../${serial}`} relative="path">
                    测试{serial}
                  </Link>
                ) : (
                  `测试${serial}`
                )}

                {index !== allTests.length - 1 ? "・" : null}
              </Fragment>
            );
          })}
      </p>
    </main>
  );
}
