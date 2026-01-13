"use client";

import type { FC, ReactElement, ReactNode } from "react";

import { cx } from "classix";
import { motion, useInView } from "motion/react";
import { Component, Fragment, useRef, useState } from "react";
import { Link, useRouter } from "waku";

import style from "../main.css?url";
import c from "../resources/count.v5.js?url";
import shiwakeBr from "../resources/shiwake-br.html?url";
import shiwake from "../resources/shiwake.html?url";

export function HeaderComponent() {
  const { path } = useRouter();
  const isRoot = path === "/";
  const navs = [
    ["/connections", "故人"],
    ["/now", "故事"],
    ["/kami", "故纸堆"],
  ] as const;
  return (
    <header className="px-8 py-4 print:hidden">
      <nav className="flex items-center">
        <Link to="/" className="mr-auto">
          <img
            alt="站点标识，为一立方体的三点透视图"
            src="/favicon.ico"
            className={cx(
              "size-12",
              isRoot ? "" : "opacity-80 hover:opacity-100",
            )}
          />
        </Link>

        {navs.map(([pathname, text], index) => (
          <Fragment key={pathname}>
            <Link
              to={pathname}
              className={cx(
                "rounded px-1 py-2 text-base",
                path.startsWith(pathname)
                  ? "font-semibold text-cat-text"
                  : "font-normal text-cat-text opacity-80 hover:opacity-100",
              )}
            >
              {text}
            </Link>
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
    <footer className="relative mx-auto p-4 pt-12 text-center text-cat-subtext1 print:hidden">
      <div>
        <small>
          <a href="https://github.com/Master-Hash/hashland">前端仓库</a>
          {/**
           * 间隔号
           * @see https://www.zhihu.com/question/20271115 */}
          {"・"}
          <a href="https://www.travellings.cn/go.html">开往</a>
          {"・"}
          <a
            href="https://xn--sr8hvo.ws/previous"
            referrerPolicy="strict-origin-when-cross-origin"
          >
            ←
          </a>
          <a
            href="https://xn--sr8hvo.ws"
            className="font-[Noto_Emoji]"
            target="_blank"
            rel="noreferrer"
          >
            🕸💍
          </a>
          <a
            href="https://xn--sr8hvo.ws/next"
            referrerPolicy="strict-origin-when-cross-origin"
          >
            →
          </a>
        </small>
      </div>
      <div>
        <small>
          <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.zh">
            CC0
          </a>{" "}
          © 公共领域
        </small>
      </div>
      <div className="hidden">
        <small>
          <a rel="nofollow" href={shiwake}>
            彩弹
          </a>
          <a rel="nofollow" href={shiwakeBr}>
            现代彩弹
          </a>
          <a rel="me" href="https://cuc.closed.social/@hash">
            Mastodon
          </a>
          <a href="https://github.com/Master-Hash" rel="me">
            github.com/Master-Hash
          </a>
        </small>
      </div>
      <div>
        <small className="before:content-[' ']">
          文章内容可能涉及隐私，若希望修改或隐藏，请
          <Link to="/email">来信</Link>联系。
        </small>
      </div>
      <Flower />
    </footer>
  );
}

function Flower() {
  "use memo";

  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 0.1,
    // margin: "0px 0px 200px 0px"
    // once: true,
  });

  const [dx1, setDx1] = useState(0);
  const [dy1, setDy1] = useState(0);
  const [dx2, setDx2] = useState(0);
  const [dy2, setDy2] = useState(0);
  const [dx3, setDx3] = useState(0);
  const [dy3, setDy3] = useState(0);

  return (
    <motion.svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      // viewBox="0 0 10 10.1"
      className={cx(
        "absolute -right-30 bottom-0 hidden h-27.5 w-27.5 stroke-cat-subtext1 stroke-[1.1] md:inline dark:stroke-[.66]",
        isInView ? "" : "md:invisible",
      )}
      strokeDasharray="1100"
      strokeLinecap="round"
    >
      <motion.path
        fill="none"
        d={`M 55 110 Q 55 55 ${88 + dx1} ${11 + dy1}`}
        className={cx(isInView && "animate-[move_3.596743542749322s_reverse]")}
      />
      <motion.path
        fill="none"
        d={`M 55 110 Q 44 55 ${22 + dx2} ${44 + dy2}`}
        className={cx(isInView && "animate-[move_2.638645458184985s_reverse]")}
      />
      <motion.path
        fill="none"
        d={`M 55 110 Q 66 66 ${88 + dx3} ${44 + dy3}`}
        className={cx(isInView && "animate-[move_3.8126738818254875s_reverse]")}
      />
      <motion.circle
        drag
        whileDrag={{
          scale: 1.1,
        }}
        dragConstraints={{
          top: -1,
          left: -1,
          right: 1,
          bottom: 1,
        }}
        dragTransition={{
          bounceStiffness: 120,
          bounceDamping: 15,
        }}
        dragElastic={0.08}
        className={cx(
          "fill-cat-yellow",
          isInView ? "animate-[scale_1.9430689123180818s_reverse]" : "",
        )}
        onUpdate={(e) => {
          setDx1(e.x);
          setDy1(e.y);
        }}
        cx="88"
        cy="11"
        // transform={`translate(${dx} ${dy})`}
        r="3.927309115328401"
      />
      <motion.circle
        drag
        whileDrag={{
          scale: 1.1,
        }}
        dragConstraints={{
          top: -1,
          left: -1,
          right: 1,
          bottom: 1,
        }}
        dragTransition={{
          bounceStiffness: 120,
          bounceDamping: 15,
        }}
        dragElastic={0.08}
        className={cx(
          "fill-cat-sapphire",
          isInView ? "animate-[scale_1.0979980141782166s_reverse]" : "",
        )}
        onUpdate={(e) => {
          setDx2(e.x);
          setDy2(e.y);
        }}
        cx="22"
        cy="44"
        r="3.234713131626697"
      />
      <motion.circle
        drag
        whileDrag={{
          scale: 1.1,
        }}
        dragConstraints={{
          top: -1,
          left: -1,
          right: 1,
          bottom: 1,
        }}
        dragTransition={{
          bounceStiffness: 120,
          bounceDamping: 15,
        }}
        dragElastic={0.08}
        className={cx(
          "fill-cat-pink",
          isInView ? "animate-[scale_1.702784229000633s_reverse]" : "",
        )}
        onUpdate={(e) => {
          setDx3(e.x);
          setDy3(e.y);
        }}
        cx="88"
        cy="44"
        r="2.2859543508394577"
      />
    </motion.svg>
  );
}

// export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
//   "use memo";
//   // const items = [
//   //   <p key={0}>
//   //     我有两位朋友擅长日语：<Link to="/人/無極.md">無極</Link>和{" "}
//   //     <Link to="/人/Alan.md">Alan</Link>。高三时我曾玩过一部美妙的歌剧{" "}
//   //     <a
//   //       href="https://store.steampowered.com/app/559210/Rakuen/"
//   //       target="_blank"
//   //       rel="noreferrer"
//   //     >
//   //       Rakuen
//   //     </a>
//   //     ，Alan 听说后指出汉字写作“X園”，無極听说汉字名“楽園”后则指出读音。
//   //   </p>,
//   //   <p key={1}></p>,
//   // ];
//   // const item = useState(Math.random());
//   // const error = useRouteError() as {
//   //   status: number;
//   //   statusText: string;
//   //   internal: boolean;
//   //   data: string;
//   //   error: Error;
//   // };
//   // console.error(error);
//   if (isRouteErrorResponse(error)) {
//     return (
//       // https://react.dev/reference/react-dom/components/title#special-rendering-behavior
//       // react@canary 会把 <meta> <title> 等自动插入 <head>
//       // 期待 Remix 的 <Meta> <Link> 如何相应更改——把逻辑移入底层是好的
//       <Fragment key="I'm unique">
//         <title>{`${error.status} ${error.statusText}`}</title>
//         <main className="">
//           <h1>{`${error.status} ${error.statusText}`}</h1>
//           {error.status === 404 ? (
//             <>
//               <p>
//                 {/* <a
//                 href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/404"
//                 target="_blank"
//                 rel="noreferrer"
//                 >
//                 404
//                 </a>
//                 属于客户端错误。你从哪里来，到哪里去，你想清楚了吗？ */}
//                 本站还在施工（对手指），如果踩空链接打消了读者阅读的兴致，实在抱歉。
//               </p>
//               {/* <h2>或者你可以先读读这些：</h2> */}
//               <p>
//                 我打算在这里设计一点奇思妙想：基于词嵌入的相关推荐，或者请大模型抽取一桩奇闻轶事。这样404的死胡同里就能有些生气了。
//               </p>
//             </>
//           ) : (
//             <p>{error.data}</p>
//           )}
//         </main>
//       </Fragment>
//     );
//   } else {
//     return (
//       <Fragment key="I'm unique too">
//         <title>未知错误</title>
//         <main className="">
//           <h1>未知错误</h1>
//           <p>为保护当事人隐私，本篇暂不公开。熟识的读者可以私下戳我预览！</p>
//           <p>本错误页面亦可能由网络连接不佳，以及服务器故障引起。</p>
//         </main>
//       </Fragment>
//     );
//   }
// }

class HashError extends Component<{ children: ReactNode }, { error?: Error }> {
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state?.error) {
      return (
        <main className="relative mx-auto prose prose-a:wrap-break-word">
          <h1>未知错误</h1>
          <p>为保护当事人隐私，本篇暂不公开。熟识的读者可以私下戳我预览！</p>
          <p>本错误页面亦可能由网络连接不佳，以及服务器故障引起。</p>
        </main>
      );
    }
    return this.props.children;
  }
}

export const Layout: FC<{
  children: ReactElement;
}> = ({ children }) => {
  return (
    <>
      <HeaderComponent />
      <HashError>{children}</HashError>
      <FooterComponent />
    </>
  );
};

export const Root: FC<{
  children: ReactElement;
}> = ({ children }) => {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="故人故事故纸堆" />
        <meta property="og:locale" content="zh_CN" />
        <meta property="og:image" content="/favicon.png" />
        <link rel="stylesheet" href={style} />
        <link
          rel="alternate"
          type="application/atom+xml"
          href="https://rsshub.app/telegram/channel/hash_elbeszelese?format=atom"
          title="Hash Elbeszélése & Kívánsága (RSSHub)"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          href="https://github.com/Master-Hash/hashland/commits/vite.atom"
          title="Recent Commits to hashland:vite"
        />
        {/* <Links /> */}
        {/* <Resources /> */}
      </head>
      <body className="grid min-h-screen grid-rows-[auto_1fr_auto] bg-cat-base text-cat-text print:block">
        {children}
        {/* <!-- Cloudflare Web Analytics --> */}
        {/* <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "fe619b97279f44bfa14a19312c4141b5"}'
          suppressHydrationWarning
        /> */}
        {/* <!-- End Cloudflare Web Analytics --> */}
        <script
          // src={ry}
          // src="https://app.rybbit.io/api/script.js"
          src="/api/script.js"
          integrity="sha384-WBOXiLIdaDPw2OyWdJ3V1edwjFBzabY9ehQD/rIkG2aD2FNwteLp+Ptr8Ep6znLq"
          data-site-id="35522e41c288"
          defer
          suppressHydrationWarning
        />
      </body>
    </html>
  );
};
