import type { PageProps } from "waku/router";

import { env } from "cloudflare:workers";
import PostalMime from "postal-mime";
import { unstable_getContext } from "waku/server";
import xss from "xss";

import { HAN_REGEX } from "../../utils/constant.ts";
import { dateFormat } from "../../utils/dateFormat.js";
import { unstable_notFound } from "waku/router/server";

export default async function DisplayMailbox({
  msgid,
}: PageProps<"/mailbox/[msgid]">) {
  // console.log(m, entries);
  // console.log("Rendering post:", _t, _p);
  const { req } = unstable_getContext();

  console.log(req.url);

  const isPrivate = req.url.endsWith("?p") || req.url.includes("?query=p");

  const { R2, REAL_NAME } = env;
  const r2url =
    (isPrivate ? "private/" : "Discuss/") + decodeURI(msgid)?.slice(1, -1) + ".eml";
  // console.log(r2url);
  const msg = await R2.get(r2url);
  if (msg === null) {
    unstable_notFound();
  } else {
    const email = await PostalMime.parse(msg.body);
    if (isPrivate) {
      if (email.from.name.replaceAll(" ", "") === REAL_NAME) {
        email.from.name = "[hash]";
      }
      if (email.sender?.name?.replaceAll(" ", "") === REAL_NAME) {
        email.sender.name = "[hash]";
      }
      email.headers = [];
    }
    console.log(email);
    const humanDate = dateFormat.format(new Date(email.date!));
    const t = `${email.subject} « 故人故事故纸堆`;
    return (
      <main className="prose mx-auto">
        <title>{t}</title>

        <meta property="og:title" content={t} />
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
        <details className="-mt-4 print:hidden">
          <summary>
            <small>详情</small>
          </summary>
          <small>
            <code>Message-ID: {email.messageId}</code>
            <br />
            <a
              href={import.meta.env.VITE_ASSETSURL + "/" + r2url}
              target="_blank"
              rel="noreferrer"
            >
              下载原始消息
            </a>
          </small>
        </details>
        <DisplayMail email={email} />
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
}

function HTMLEmail({ html }: { html: string }) {
  // 市面上各种 DOM 解析器都依赖 Node.js 的流
  // 加上 Bundle Size 很不满意
  // 如果真这么搞，我的意见是不如 rehype + recma + eval
  // 因为用户来信不能构建时确定
  // 我的意见是，就搞 dangerous inner HTML!
  // globalThis.window = globalThis.window || new JSDOM("").window;
  // const e = parse(html, options);
  // return e;

  // 默认值看起来不错
  const sanitizedHtml = xss(html, {
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script", "style"],
  });
  return <section dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}

function DisplayMail({ email }: { email: Email }) {
  const { text, html } = email;
  console.log(text, html);
  return html ? (
    <HTMLEmail html={html} />
  ) : text ? (
    <PlainEmail text={text} />
  ) : null;
}

function PlainEmail({ text }: { text: string }) {
  const isHan = (text || "").match(HAN_REGEX);

  return (
    <section className="-mt-4">
      <pre
        className={
          "whitespace-pre-wrap " +
          (isHan
            ? "indent-[1ic_hanging_each-line]"
            : "indent-[2ch_hanging_each-line]")
        }
      >
        {/* 软换行缩进是我的习惯。 */}
        {/* 当然，也是发现自己总是写超80字符（尤其是超链接，没有颜色真不好读）后被迫想的弥补办法 */}
        {/* 如果你讨厌这个样式，你可以根据你的喜好让我定制。我为每个收件人写套样式都是可以的。 */}
        {/* 在 RSC 正式版出来之前，我绝不考虑 HTML 格式 */}
        {text}
      </pre>
    </section>
  );
}

export const getConfig = () => {
  return {
    render: "dynamic",
  } as const;
};
