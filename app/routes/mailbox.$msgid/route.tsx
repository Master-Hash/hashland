import PostalMime from "postal-mime";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { HAN_REGEX } from "../../utils/constant.js";
import { dateFormat } from "../../utils/dateFormat.js";
import type { ComponentProps } from "./+types.route.js";

export const meta: MetaFunction = ({ data }) => {
  return [{ title: `${data.email.subject} « 故人故事故纸堆` }];
};

/**
 * @todo 同理，回复线程，真的有人回复了再写。
 */
export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const { DB, R2 } = context.cloudflare.env as Env;
  const r2url = "Discuss/" + params.msgid?.slice(1, -1) + ".eml";
  const msg = await R2.get(r2url);
  if (msg === null) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  } else {
    const email = await PostalMime.parse(msg.body);
    console.log(email);
    return { email, r2url };
  }
};

export default function DisplayMailbox({ loaderData }: ComponentProps) {
  const { email, r2url } = loaderData;
  const humanDate = dateFormat.format(new Date(email.date!));
  const isHan = (email.text || "").match(HAN_REGEX);
  return (
    <main className="prose mx-auto">
      {/* h1 应当是唯一的 */}
      {/* <h1>邮件存档</h1> */}
      <h2>{email.subject}</h2>
      <p>
        <small>
          {humanDate}，
          <a href={"mailto:" + email.from.address}>{email.from.name}</a>：
        </small>
        <br />
      </p>
      <details className="-my-4 print:hidden">
        <summary>
          <small>详情</small>
        </summary>
        <small>
          <code>Message-ID: {email.messageId}</code>
          <br />
          <a href={import.meta.env.VITE_ASSETSURL + "/" + r2url}>
            下载原始消息
          </a>
        </small>
      </details>
      {/* 软换行缩进是我的习惯。 */}
      {/* 当然，也是发现自己总是写超80字符（尤其是超链接，没有颜色真不好读）后被迫想的弥补办法 */}
      {/* 如果你讨厌这个样式，你可以根据你的喜好让我定制。我为每个收件人写套样式都是可以的。 */}
      {/* 在 RSC 正式版出来之前，我绝不考虑 HTML 格式 */}
      <pre
        className={
          "whitespace-pre-wrap " +
          (isHan
            ? "indent-[1ic_hanging_each-line]"
            : "indent-[2ch_hanging_each-line]")
        }
      >
        {email.text}
      </pre>
      <hr className="print:hidden" />
      <p className="text-cat-text print:hidden">
        <a
          href="https://github.com/Master-Hash/discuss/blob/main/tos.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          来信指南
        </a>
        和
        <a
          href="https://gist.github.com/Master-Hash/0b3fdbb6d1e864aabbdda1c0460eed28"
          target="_blank"
          rel="noopener noreferrer"
        >
          开发笔记
        </a>
        供有需要和兴趣的读者参阅。
      </p>
    </main>
  );
}
