import { Link, type LoaderFunctionArgs, type MetaFunction } from "react-router";
import type {
  ComponentProps,
  LoaderArgs,
} from "./+types.d1-lantency.$testid.js";

export const meta: MetaFunction = ({ params }) => {
  return [{ title: `D1延迟测试${params.testid} « 故人故事故纸堆` }];
};

export const loader = async ({
  context,
  params,
}: LoaderArgs & LoaderFunctionArgs) => {
  const { DB } = context.cloudflare.env as Env;
  const workerdStartTime = new Date().valueOf() / 1000;
  const statement = DB.prepare("SELECT unixepoch('subsec')");
  // const statement2 = DB.prepare("SELECT unixepoch()");
  //  console.log("WorkerD Time:", workerdStartTime);
  switch (params.testid) {
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
    default:
      throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }
};

export default function DisplayMailbox({ loaderData, params }: ComponentProps) {
  const allTests = [1, 2];
  return (
    <main className="prose mx-auto">
      <h1>D1延迟测试{params.testid}</h1>
      <ul>
        <li>{loaderData.workerdStartTime}：WorkerD 开始时间</li>
        <li>
          {loaderData.res}：D1返回的第一个时间戳（+
          {1000 * (loaderData.res! - loaderData.workerdStartTime)}ms）
        </li>
        {loaderData.res2 ? (
          <li>
            {loaderData.res2}：D1返回的第二个时间戳（+
            {1000 * (loaderData.res2 - loaderData.res!)}ms）
          </li>
        ) : null}
        <li>
          {loaderData.workerdEndTime}：WorkerD 结束时间（+
          {1000 *
            (loaderData.workerdEndTime -
              (loaderData.res2 ? loaderData.res2 : loaderData.res!))}
          ms）
        </li>
      </ul>
      <p>娱乐测试，仅供参考。应配合F12观测。</p>
      {allTests.map((serial) => {
        return serial.toString() !== params.testid ? (
          <Link to={`../${serial}`} relative="path">
            测试{serial}
          </Link>
        ) : null;
      })}
      {/* h1 应当是唯一的 */}
      {/* <h1>邮件存档</h1> */}
    </main>
  );
}
