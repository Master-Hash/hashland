import { StrictMode } from "react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  Link,
  ScrollRestoration,
  useCatch,
  NavLink,
} from "remix";
import type {
  MetaFunction,
  LinksFunction,
} from "remix";
import { RssIcon } from "@heroicons/react/solid";
// import { dateFormat } from "./utils/dateFormat.js";
import styles from "./main.css";
import { CatchBoundaryComponent } from "@remix-run/react/routeModules";

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
        <body className="dark:bg-zinc-800">
          <HeaderComponent />
          <main className="mx-3 sm:mx-auto my-6 max-w-prose dark:text-white"><Outlet /></main>
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
    <header className="flex mx-auto justify-between items-center text-gray-500 dark:text-zinc-300 pr-[.6rem] sm:mx-2 lg:my-2 lg:mx-4">
      <div>
        <NavLink to="/" className="flex items-center" end>
          {({ isActive }) => (
            <>
              <img alt="" src="/favicon.svg" className="w-12 h-12 inline" />
              <span className={`ml-[.6rem] underline hover:opacity-80 ${isActive ? "font-semibold" : "font-medium"}`}>Hashland</span>
            </>
          )}
        </NavLink>
      </div>
      <nav className="">
        <ul className="flex space-x-4 sm:space-x-8">
          {[
            ["/posts", "文章"],
            ["/collections", "专栏"],
            ["/friends", "友链"]
          ]
            .map(([pathname, text]) => <li key={pathname}>
              <NavLink to={pathname} className={({ isActive }) => isActive ? "text-base font-semibold underline hover:opacity-80" : "text-base font-normal underline hover:opacity-80"}>
                {text}
              </NavLink>
            </li>
            )}
          <a href="/atom" className="border-0 hover:opacity-80" target="_blank" rel="noreferrer">
            <RssIcon transform="translate(0 2)" className="h-5 w-5" />
          </a>
        </ul>
      </nav>
    </header>
  );
}

function FooterComponent() {
  return (
    <footer className="mx-auto text-center p-4 dark:text-white">
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
          <Link to="https://creativecommons.org/publicdomain/zero/1.0/deed.zh" target="_blank" rel="noreferrer" className="underline">CC0</Link> © 公共领域
        </small>
      </div>
    </footer>
  );
}

