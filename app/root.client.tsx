"use client";

import { Fragment, use } from "react";
import {
  isRouteErrorResponse,
  Link,
  NavLink,
  ScrollRestoration,
} from "react-router";
import { NonceContext } from "../app/nonce.client.tsx";
import type { Route } from "./+types/root.ts";
import shiwake from "./shiwake.html?url";

export function WrappedScrollRestoration() {
  const nonce = use(NonceContext);
  return <ScrollRestoration nonce={nonce} />;
}

export function HeaderComponent() {
  return (
    <header className="px-8 py-4 print:hidden">
      <nav className="flex items-center">
        <NavLink to="/" className="mr-auto" end>
          {({ isActive }) => (
            <img
              alt="站点标识，为一立方体的三点透视图"
              src="/favicon.ico"
              className={
                "size-12" + (isActive ? "" : " opacity-80 hover:opacity-100")
              }
            />
          )}
        </NavLink>

        {[
          ["/connections", "故人"],
          ["/now", "故事"],
          ["/kami", "故纸堆"],
        ].map(([pathname, text], index) => (
          <Fragment key={pathname}>
            <NavLink
              to={pathname}
              className={({ isActive }) =>
                (isActive
                  ? "text-cat-text font-semibold"
                  : "text-cat-text font-normal opacity-80 hover:opacity-100") +
                " rounded px-1 py-2 text-base"
              }
            >
              {text}
            </NavLink>
            {/* ・ */}
            {index !== 2 ? "・" : ""}
          </Fragment>
        ))}
        {/* <a
          href="https://rsshub.app/telegram/channel/hash_elbeszelese"
          // content-center
          // but now is not needed?
          className="p-2 text-[0px] opacity-80 hover:opacity-100"
          target="_blank"
          rel="noreferrer"
        >
          <span className="icon-[streamline--rss-symbol-solid] text-[1rem]" />
          RSS feed
        </a> */}
      </nav>
    </header>
  );
}

export function FooterComponent() {
  return (
    <footer className="text-cat-subtext1 mx-auto p-4 pt-12 text-center print:hidden">
      <div>
        <small>
          <a
            href="https://github.com/Master-Hash/hashland"
            target="_blank"
            rel="noreferrer"
            // className="hover:text-cat-teal"
          >
            前端仓库
          </a>
          {/**
           * 间隔号
           * @see https://www.zhihu.com/question/20271115 */}
          {"・"}
          <a
            href="https://github.com/Master-Hash/post-test"
            target="_blank"
            rel="noreferrer"
            // className="hover:text-cat-teal"
          >
            文章仓库
          </a>
          {"・"}
          <a
            href="https://www.travellings.cn/go.html"
            target="_blank"
            rel="noreferrer"
            // className="hover:text-cat-teal"
          >
            开往
          </a>
        </small>
      </div>
      <div>
        <small>
          <a
            href="https://creativecommons.org/publicdomain/zero/1.0/deed.zh"
            target="_blank"
            rel="noreferrer"
            // className="hover:text-cat-teal"
          >
            CC0
          </a>{" "}
          © 公共领域
        </small>
      </div>
      <div className="hidden">
        <small>
          <a href={shiwake}>彩弹</a>
          <a rel="me" href="https://cuc.closed.social/@hash">
            Mastodon
          </a>
        </small>
      </div>
      <div>
        <small className="before:content-[' ']">
          文章内容可能涉及隐私，若希望修改或隐藏，请
          <Link to="/email">来信</Link>联系。
        </small>
      </div>
    </footer>
  );
}

export function ErrorReporter({ error }: Route.ErrorBoundaryProps) {
  // const items = [
  //   <p key={0}>
  //     我有两位朋友擅长日语：<Link to="/人/無極.md">無極</Link>和{" "}
  //     <Link to="/人/Alan.md">Alan</Link>。高三时我曾玩过一部美妙的歌剧{" "}
  //     <a
  //       href="https://store.steampowered.com/app/559210/Rakuen/"
  //       target="_blank"
  //       rel="noreferrer"
  //     >
  //       Rakuen
  //     </a>
  //     ，Alan 听说后指出汉字写作“X園”，無極听说汉字名“楽園”后则指出读音。
  //   </p>,
  //   <p key={1}></p>,
  // ];
  // const item = useState(Math.random());
  // const error = useRouteError() as {
  //   status: number;
  //   statusText: string;
  //   internal: boolean;
  //   data: string;
  //   error: Error;
  // };
  // console.error(error);
  if (isRouteErrorResponse(error)) {
    return (
      // https://react.dev/reference/react-dom/components/title#special-rendering-behavior
      // react@canary 会把 <meta> <title> 等自动插入 <head>
      // 期待 Remix 的 <Meta> <Link> 如何相应更改——把逻辑移入底层是好的
      <Fragment key="I'm unique">
        <title>{`${error.status} ${error.statusText}`}</title>
        <main className="prose prose-a:break-words relative mx-auto">
          <h1>{`${error.status} ${error.statusText}`}</h1>
          {error.status === 404 ? (
            <>
              <p>
                {/* <a
                href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/404"
                target="_blank"
                rel="noreferrer"
                >
                404
                </a>
                属于客户端错误。你从哪里来，到哪里去，你想清楚了吗？ */}
                本站还在施工（对手指），如果踩空链接打消了读者阅读的兴致，实在抱歉。
              </p>
              {/* <h2>或者你可以先读读这些：</h2> */}
              <p>
                我打算在这里设计一点奇思妙想：基于词嵌入的相关推荐，或者请大模型抽取一桩奇闻轶事。这样404的死胡同里就能有些生气了。
              </p>
            </>
          ) : (
            <p>{error.data}</p>
          )}
        </main>
      </Fragment>
    );
  } else {
    return (
      <Fragment key="I'm unique too">
        <title>未知错误</title>
        <main className="prose prose-a:break-words relative mx-auto">
          <h1>未知错误</h1>
          <p>为保护当事人隐私，本篇暂不公开。熟识的读者可以私下戳我预览！</p>
          <p>本错误页面亦可能由网络连接不佳，以及服务器故障引起。</p>
        </main>
      </Fragment>
    );
  }
}
