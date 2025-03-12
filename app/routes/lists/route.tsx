import { useEffect } from "react";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
// import { useLoaderData } from "react-router";
// import { Mailbox } from "../../../stories/Mailbox.js";
// import P1 from "./p1.md";
// import P2 from "./p2.md";

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: `公开信箱 « 故人故事故纸堆` },
    // { name: "description", content: "Welcome to Remix!" },
    // 等人工智能来归纳
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { DB } = context.cloudflare.env as Env;
  const statementThreads = DB.prepare(
    // 我们暂且让他匿名吧……邮箱不是很有必要公开
    "SELECT Epoch, json(Author), MessageID, SubjectLine FROM GlobalMessages WHERE Folder = 'Discuss' AND InReplyTo IS NULL ORDER BY Epoch DESC LIMIT 200",
  );
  // const statementSent = DB.prepare(
  //   "SELECT Epoch, json_extract(Recipients, '$[0].address'), json_array_length(Recipients), MessageIDHash FROM GlobalMessages WHERE Folder = 'Sent' AND Epoch IN (SELECT MAX(Epoch) FROM GlobalMessages WHERE Folder = 'Sent' GROUP BY json_extract(Recipients, '$[0].address'), json_extract(Recipients, '$[1].address'), json_extract(Recipients, '$[2].address')) ORDER BY Epoch DESC LIMIT 5",
  // );
  const threads = await statementThreads.all<{
    Epoch: number;
    Author: {
      name: string;
      address: string;
    };
    MessageID: string;
    SubjectLine: string;
  }>();
  // const { results } = rows[0] as {
  //   results: Array<{
  //     Epoch: number;
  //     "json_extract(Author, '$.address')": string;
  //     MessageIDHash: string;
  //   }>;
  // };
  // const { results: resultsSent } = rows[1] as {
  //   results: Array<{
  //     Epoch: number;
  //     "json_extract(Recipients, '$[0].address')": string;
  //     "json_array_length(Recipients)": number;
  //     MessageIDHash: string;
  //   }>;
  // };
  // console.log(results);
  // console.log(resultsSent);
  // const processed = results.map((result) => {
  //   const ISOString = new Date(result["Epoch"] * 1000).toISOString();
  //   const fullTimeString =
  //     ISOString.slice(2, 10) + " " + ISOString.slice(11, 16);
  //   const [first] = result["json_extract(Author, '$.address')"].split("@");
  //   let _address;
  //   if (
  //     ["admission", "notifications", "forum"].includes(first) ||
  //     first.match(/reply/)
  //   ) {
  //     _address = "noreply@~~~~~";
  //   } else {
  //     _address = first[0] + "~~~~~~@~~~~~";
  //   }
  //   return {
  //     datetime:
  //       fullTimeString.slice(0, 6) + "~~" + fullTimeString.slice(8, 12) + "~~",
  //     address: _address,
  //     hash: result["MessageIDHash"],
  //     isMultipleRecipient: false,
  //   };
  // });
  // const processedSent = resultsSent.map((result) => {
  //   const ISOString = new Date(result["Epoch"] * 1000).toISOString();
  //   const fullTimeString =
  //     ISOString.slice(2, 10) + " " + ISOString.slice(11, 16);
  //   const [first, _second] =
  //     result["json_extract(Recipients, '$[0].address')"].split("@");
  //   const [second] = _second.split(".");
  //   const address = (["discuss"].includes(first) ? first : ("~~~~~~" + first.at(-1)))
  //     + "@" + "~~" + second.at(-1) + ".~";
  //   return {
  //     datetime: fullTimeString.slice(0, 12) + "~~",
  //     address,
  //     isMultipleRecipient: result["json_array_length(Recipients)"] > 1,
  //     hash: result["MessageIDHash"],
  //   };
  // });
  return { threads };
};

export default function Email() {
  const { threads } = useLoaderData();
  useEffect(() => {
    console.log(threads);
  }, [threads]);
  return null;
  // return (
  //   <main className="prose relative mx-auto">
  //     {/* <aside className="absolute bottom-0 right-0 text-6xl text-cat-text md:-right-12 md:top-0 lg:-right-24">
  //       <div className="icon-[fluent-emoji-high-contrast--postbox] -rotate-[9deg]" />
  //     </aside> */}
  //     <P1 />
  //     <h2>收件</h2>
  //     <Mailbox messages={inbox} />
  //     <h2>寄件</h2>
  //     <Mailbox messages={sent} />
  //     <P2 />
  //   </main>
  // );
}
