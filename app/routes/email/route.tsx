// import { useLoaderData } from "react-router";
import { useEffect } from "react";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import type { Message } from "../../../stories/Mailbox.js";
import { Mailbox } from "../../../stories/Mailbox.js";
import { HrefToLink } from "../../utils/components.js";
import { useTime } from "../../utils/hooks.js";
import type { ComponentProps } from "./+types.route.js";
import P1 from "./p1.md";
import P2 from "./p2.md";
import P3 from "./p3.md";

export const meta: MetaFunction = () => {
  return [
    { title: `电子邮件 « 故人故事故纸堆` },
    // { name: "description", content: "Welcome to Remix!" },
    // 等人工智能来归纳
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { DB } = context.cloudflare.env as Env;
  const statementInbox = DB.prepare(
    // It suppose each Epoch is unique. Any more elegant way?
    "SELECT Epoch, json_extract(Author, '$.address'), MessageIDHash FROM GlobalMessages WHERE Folder = 'Inbox' AND Epoch IN (SELECT MAX(Epoch) FROM GlobalMessages WHERE Folder = 'Inbox' GROUP BY json_extract(Author, '$.address')) ORDER BY Epoch DESC LIMIT 5",
  );
  const statementSent = DB.prepare(
    "SELECT Epoch, json_extract(Recipients, '$[0].address'), json_array_length(Recipients), MessageIDHash FROM GlobalMessages WHERE Folder = 'Sent' AND Epoch IN (SELECT MAX(Epoch) FROM GlobalMessages WHERE Folder = 'Sent' GROUP BY json_extract(Recipients, '$[0].address'), json_extract(Recipients, '$[1].address'), json_extract(Recipients, '$[2].address')) ORDER BY Epoch DESC LIMIT 5",
  );
  const statementThreads = DB.prepare(
    "SELECT Epoch, json(Author), MessageID, SubjectLine FROM GlobalMessages WHERE Folder = 'Discuss' AND unixepoch() - EPOCH > 37 * 60 AND InReplyTo IS NULL ORDER BY Epoch DESC LIMIT 5",
  );
  const statementEarliestInQueue = DB.prepare(
    "SELECT Epoch FROM GlobalMessages WHERE Folder = 'Discuss' AND unixepoch() - EPOCH < 37 * 60 ORDER BY Epoch ASC LIMIT 1",
  );
  const rows = await DB.batch([
    statementInbox,
    statementSent,
    statementThreads,
    statementEarliestInQueue,
  ]);
  const { results } = rows[0] as {
    results: Array<{
      Epoch: number;
      "json_extract(Author, '$.address')": string;
      MessageIDHash: string;
    }>;
  };
  const { results: resultsSent } = rows[1] as {
    results: Array<{
      Epoch: number;
      "json_extract(Recipients, '$[0].address')": string;
      "json_array_length(Recipients)": number;
      MessageIDHash: string;
    }>;
  };
  const { results: resultsThreads } = rows[2] as {
    results: Array<{
      Epoch: number;
      "json(Author)": string;
      MessageID: string;
      SubjectLine: string;
    }>;
  };
  const { results: resultsEarliestInQueue } = rows[3] as {
    results: Array<{
      Epoch: number;
    }>;
  };
  console.log(results);
  console.log(resultsSent);
  console.log(resultsThreads);
  console.log(resultsEarliestInQueue);
  const processed = results.map((result) => {
    const ISOString = new Date(result.Epoch * 1000).toISOString();
    const fullTimeString =
      ISOString.slice(0, 10) + " " + ISOString.slice(11, 16);
    const [first] = result["json_extract(Author, '$.address')"].split("@");
    let _address;
    if (
      ["admission", "notifications", "forum"].includes(first) ||
      first.match(/reply/)
    ) {
      _address = "noreply@~~~~~";
    } else {
      _address = first[0] + "~~~~~~@~~~~~";
    }
    return {
      datetime:
        fullTimeString.slice(0, 6 + 2) +
        "~~" +
        fullTimeString.slice(8 + 2, 12 + 2) +
        "~~",
      address: _address,
      hash: result["MessageIDHash"],
    };
  });
  const processedSent = resultsSent.map((result) => {
    const ISOString = new Date(result.Epoch * 1000).toISOString();
    const fullTimeString =
      ISOString.slice(0, 10) + " " + ISOString.slice(11, 16);
    const [first, _second] =
      result["json_extract(Recipients, '$[0].address')"].split("@");
    const [second] = _second.split(".");
    const address =
      (["discuss"].includes(first) ? first : "~~~~~~" + first.at(-1)) +
      "@" +
      "~~" +
      second.at(-1) +
      ".~";
    return {
      datetime: fullTimeString.slice(0, 12 + 2) + "~~",
      address,
      recipientLength: result["json_array_length(Recipients)"],
      hash: result["MessageIDHash"],
    };
  });

  // 查询每个讨论有几个人参与
  // 大概的思路：
  // 查找 In-Reply-To 是目标的；
  // 以及 In-Reply-To 的 In-Reply-To 是目标的；
  /**
   * @todo 等真的有递归线程了再来，不迟。
   */
  const TODO = 1;

  const threads = resultsThreads.map((result) => {
    const ISOString = new Date(result.Epoch * 1000).toISOString();
    const fullTimeString =
      ISOString.slice(0, 10) + " " + ISOString.slice(11, 16);
    const author = JSON.parse(result["json(Author)"]);
    return {
      datetime: fullTimeString,
      timestamp: result.Epoch,
      address: author.name + ` <${author.address}>`,
      hash: result.MessageID,
      subject: result.SubjectLine,
      // 这里实际上是参与讨论的人数
      recipientLength: TODO,
    };
  }) satisfies Array<Message>;

  // 筛掉最近37分钟的邮件，然后取出
  const earistThreadTime =
    resultsEarliestInQueue.length > 0 ? resultsEarliestInQueue[0].Epoch : null;

  return {
    inbox: processed,
    sent: processedSent,
    threads,
    earistThreadTime,
  };
};

export default function Email({ loaderData }: ComponentProps) {
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
