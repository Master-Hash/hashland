import type { FC, ReactElement } from "react";
import { Fragment, use } from "react";
import type { HeadersFunction, LinksFunction } from "react-router";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./main.css";
// import style from "./main.css?url";
// 后者有 bug，会导致 client 和 server 的 css 双双被加载
import type { Route } from "./+types/root.ts";
import { NonceContext } from "./utils/components.tsx";

// 这些应该在页面路由，而不是根路由
// export const meta: MetaFunction = () => {
//   return [
//     {
//       // "og:site_name": "Hashland",
//       // title: "Hashland",
//       // "og:title": "Hashland",
//       // "og:description": "()",
//       // description: "()",
//       robots: "follow, index",
//     },
//   ];
// };

export const links: LinksFunction = () => {
  return [
    // {
    //   href: style,
    //   rel: "preload",
    //   as: "style",
    // },
    {
      rel: "icon",
      href: "/favicon.ico",
      type: "image/svg+xml",
    },
    // {
    //   href: "https://fonts.googleapis.com/css2?family=Noto+Emoji:wght@300..700&family=Playfair:ital,opsz,wght@0,5..1200,300..900;1,5..1200,300..900&display=swap",
    //   rel: "stylesheet",
    // },
    // {
    //   rel: "alternate",
    //   type: "application/rss+xml",
    //   href: "/pub.xml",
    //   title: "Hash's Publications",
    // },
    {
      rel: "alternate",
      type: "application/atom+xml",
      href: "https://rsshub.app/telegram/channel/hash_elbeszelese?format=atom",
      title: "Hash Elbeszélése & Kívánsága (RSSHub)",
    },
    {
      rel: "alternate",
      type: "application/atom+xml",
      href: "https://github.com/Master-Hash/hashland/commits/main.atom",
      title: "Recent Commits to hashland:main",
    },
    // {
    //   rel: "stylesheet",
    //   href: style,
    // },
    // {
    //   rel: "search",
    //   type: "application/opensearchdescription+xml",
    //   title: "Hashland",
    //   href: `${SITEURL}/osd`,
    // }
  ];
};

// export const loader = defineLoader(({ response }) => {
// export const loader = () => {
// response.headers.append(
//   "content-security-policy",
//   "default-src 'self'; style-src-attr 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval'; script-src-elem 'self' 'unsafe-inline'; worker-src 'self' blob:; img-src 'self' data: " +
//     (import.meta.env.DEV ? "" : ""),
// );
// return {nonce};
// };

export const headers: HeadersFunction = () => ({});

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
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

export const Layout: FC<{
  children: ReactElement;
}> = ({ children }) => {
  const nonce = use(NonceContext); // 这一行没有编译到客户端，这是为什么？
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body className="bg-cat-base text-cat-text grid min-h-screen grid-rows-[auto_1fr_auto] print:block">
        <HeaderComponent />
        {children}
        <FooterComponent />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        {/* Cloudflare Web Analytics */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "7f3186f1aa024cc38438e5416264242e"}'
        />
        {/* End Cloudflare Web Analytics */}
      </body>
    </html>
  );
};

function HeaderComponent() {
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
          ["/narrative", "故事"],
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

function FooterComponent() {
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
      <div>
        <small className="before:content-[' ']">
          文章内容可能涉及隐私，若希望修改或隐藏，请
          <Link to="/email">来信</Link>联系。
        </small>
      </div>
    </footer>
  );
}
