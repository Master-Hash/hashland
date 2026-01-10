import type { LoaderFunctionArgs } from "react-router";

// import { useLoaderData } from "react-router";
import { env } from "cloudflare:workers";

import type { Message } from "../../../stories/Mailbox.tsx";
import type { Route } from "./+types/route.ts";

import { EmailClient } from "./c.tsx";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { DB } = env;
  const session = DB.withSession("first-unconstrained");
  const statementInbox = session.prepare(
    // It suppose each Epoch is unique. Any more elegant way?
    "SELECT Epoch, json_extract(Author, '$.address'), MessageIDHash FROM GlobalMessages WHERE Folder = 'Inbox' AND Epoch IN (SELECT MAX(Epoch) FROM GlobalMessages WHERE Folder = 'Inbox' GROUP BY json_extract(Author, '$.address')) ORDER BY Epoch DESC LIMIT 5",
  );
  const statementSent = session.prepare(
    "SELECT Epoch, json_extract(Recipients, '$[0].address'), json_array_length(Recipients), MessageIDHash FROM GlobalMessages WHERE Folder = 'Sent' AND Epoch IN (SELECT MAX(Epoch) FROM GlobalMessages WHERE Folder = 'Sent' GROUP BY json_extract(Recipients, '$[0].address'), json_extract(Recipients, '$[1].address'), json_extract(Recipients, '$[2].address')) ORDER BY Epoch DESC LIMIT 5",
  );
  const statementThreads = session.prepare(
    "SELECT Epoch, json(Author), MessageID, SubjectLine FROM GlobalMessages WHERE Folder = 'Discuss' AND unixepoch() - EPOCH > 37 * 60 AND InReplyTo IS NULL ORDER BY Epoch DESC LIMIT 5",
  );
  const statementEarliestInQueue = session.prepare(
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

export default function Email({ loaderData }: Route.ComponentProps) {
  return <EmailClient loaderData={loaderData} />;
}
