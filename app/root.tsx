import { StrictMode } from "react";
import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";

import {
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";
import { Icon } from "@iconify-icon/react";
import rssIcon from "@iconify-icons/heroicons-solid/rss.js";

// import { dateFormat } from "./utils/dateFormat.js";
import styles from "./main.css";
import { CatchBoundaryComponent } from "@remix-run/react/dist/routeModules.js";
import { SITEURL } from "./utils/constant.js";

export const meta: MetaFunction = () => {
  return {
    "og:site_name": "Hashland",
    // 这些应该在页面路由，而不是根路由
    // title: "Hashland",
    // "og:title": "Hashland",
    // "og:description": "()",
    // description: "()",
    robots: "follow, index",
  };
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      href: "/favicon.svg",
      type: "image/svg+xml",
    },
    {
      rel: "alternate",
      type: "application/atom+xml",
      href: "/atom",
      title: "Hashland",
    },
    {
      rel: "stylesheet",
      href: styles,
    },
    // {
    //   rel: "search",
    //   type: "application/opensearchdescription+xml",
    //   title: "Hashland",
    //   href: `${SITEURL}/osd`,
    // }
  ];
};

export default function App() {
  return (
    <StrictMode>
      <html lang="zh-cn">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width,initial-scale=1.0" />
          <Meta />
          <Links />
        </head>
        <body className="dark:bg-zinc-800 flex flex-col min-h-screen">
          <HeaderComponent />
          <main className="flex-grow mx-3 sm:mx-auto my-6 max-w-prose dark:text-white"><Outlet /></main>
          <FooterComponent />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </StrictMode>
  );
}

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();
  console.log(caught);
  return (
    <html>
      <head>
        <title>{caught.status} {caught.statusText}</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta property="og:title" content={`${caught.status} ${caught.statusText}`} />
        <meta name="description" content={`${caught.status} ${caught.statusText}`} />
        <meta property="og:description" content={`${caught.status} ${caught.statusText}`} />
        <Meta />
        <Links />
      </head>
      <body className="dark:bg-zinc-800">
        <HeaderComponent />
        <main className="">
          <article className="prose dark:prose-invert mx-auto">
            <h1>
              {caught.status} {caught.statusText}
            </h1>
            {caught.status === 404
              ? <p><a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/404" target="_blank" rel="noreferrer">404</a>属于客户端错误。你从哪里来，到哪里去，你想清楚了吗？</p>
              : caught.status === 400
                ? <p>请指定搜索参数：<code>/search?q=%s</code></p>
                : <p>{caught.data}</p>}
          </article>
        </main>
        <FooterComponent />
        <Scripts />
      </body>
    </html>
  );
};

function HeaderComponent() {
  return (
    <header className="flex-grow-0 flex-shrink-0 px-8 py-4 text-gray-500 dark:text-zinc-300 print:hidden">
      <nav className="flex space-x-6 items-center">
        <NavLink to="/" className="mr-auto hover:opacity-80" end>
          {({ isActive }) =>
            <img alt="Hashland cube logo" src="/favicon.svg" className="w-12 h-12" />
          }
        </NavLink>

        {[
          ["/posts", "文章"],
          ["/collections", "专栏"],
          ["/friends", "友链"]
        ]
          .map(([pathname, text]) =>
            <NavLink end key={pathname} to={pathname} className={({ isActive }) =>
              (isActive
                ? "font-semibold"
                : "font-normal")
              + " text-base hover:opacity-80"}
            >
              {text}
            </NavLink>
          )}
        <a href="/atom" className="flex hover:opacity-80 items-center" target="_blank" rel="noreferrer">
          <Icon icon={rssIcon} />
        </a>
      </nav>
    </header>
  );
}

function FooterComponent() {
  return (
    <footer className="flex-grow-0 flex-shrink-0 mx-auto p-4 text-center dark:text-white print:hidden">
      {/* <div>
            <small>
              缓存更新于{dateFormat.format(new Date())}
            </small>
          </div> */}
      {/* 最终没有选择 deno 类似的 Github 贴纸 */}
      <div>
        <small>
          <a href="https://github.com/Master-Hash/hashland" target="_blank" rel="noreferrer" className="underline">前端仓库</a>
          {/**
               * 间隔号
               * @see https://www.zhihu.com/question/20271115 */}
          {"・"}
          <a href="https://github.com/Master-Hash/post" target="_blank" rel="noreferrer" className="underline">文章仓库</a>
        </small>
      </div>
      <div>
        <small>
          <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.zh" target="_blank" rel="noreferrer" className="underline">CC0</a> © 公共领域
        </small>
      </div>
    </footer>
  );
}

