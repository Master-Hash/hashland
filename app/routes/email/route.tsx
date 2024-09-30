// import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { Mailbox } from "../../../stories/Mailbox.js";
import { HrefToLink } from "../../utils/components.js";
import P1 from "./p1.md";
import P2 from "./p2.md";

interface Env {
  DB: D1Database;
}

export const meta: MetaFunction = ({ data }) => {
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
  const rows = await DB.batch([statementInbox, statementSent]);
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
  console.log(results);
  console.log(resultsSent);
  const processed = results.map((result) => {
    const ISOString = new Date(result["Epoch"] * 1000).toISOString();
    const fullTimeString =
      ISOString.slice(2, 10) + " " + ISOString.slice(11, 16);
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
        fullTimeString.slice(0, 6) + "~~" + fullTimeString.slice(8, 12) + "~~",
      address: _address,
      hash: result["MessageIDHash"],
      isMultipleRecipient: false,
    };
  });
  const processedSent = resultsSent.map((result) => {
    const ISOString = new Date(result["Epoch"] * 1000).toISOString();
    const fullTimeString =
      ISOString.slice(2, 10) + " " + ISOString.slice(11, 16);
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
      datetime: fullTimeString.slice(0, 12) + "~~",
      address,
      isMultipleRecipient: result["json_array_length(Recipients)"] > 1,
      hash: result["MessageIDHash"],
    };
  });
  return { inbox: processed, sent: processedSent };
};

export default function Email() {
  const { inbox, sent } = useLoaderData();
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
    </main>
  );
}
