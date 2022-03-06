import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  Link,
  ScrollRestoration,
} from "remix";
import type {
  MetaFunction,
  LinksFunction,
} from "remix";
import { RssIcon } from "@heroicons/react/outline";
import { dateFormat } from "./utils/dateFormat.js";
import styles from "./main.css";

export const meta: MetaFunction = () => {
  return {
    title: "Hashland",
    "og:site_name": "Hashland",
    // 这些应该在页面路由，而不是根路由
    // "og:title": "Hashland",
    // "og:image": "",
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
    <html lang="zh-cn">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        <header className="flex mx-auto justify-between items-center max-w-screen-lg py-6">
          <Link to="/" className="flex items-center border-0">
            <img alt="" src="/favicon.svg" className="w-12 h-12 inline" />
            <a href="/" className="ml-4">Hashland</a>
          </Link>
          <nav className="">
            <ul className="flex">
              {[
                ["/posts", "动态"],
                ["/collections", "专栏"],
                ["/friends", "友链"]
              ]
                .map(([url, text]) =>
                  <li key={url}><Link to={url} className="mr-10 text-base font-normal">{text}</Link></li>
                )}
              <Link to="/atom" className="border-0" target="_blank" rel="noreferrer">
                <RssIcon transform="translate(0 2)" className="h-5 w-5" />
              </Link>
            </ul>
          </nav>
        </header>
        <main><Outlet /></main>
        <footer className="mx-auto text-center p-12">
          <div>
            <small>
              缓存更新于{dateFormat.format(new Date())}
            </small>
          </div>
          {/* 最终没有选择 deno 类似的 Github 贴纸 */}
          <div>
            <small>
              <a href="https://github.com/Master-Hash/hashland" target="_blank" rel="noreferrer">前端仓库</a>
              {/**
               * 间隔号
               * @see https://www.zhihu.com/question/20271115 */}
              {"・"}
              <a href="https://github.com/Master-Hash/post" target="_blank" rel="noreferrer">文章仓库</a>
            </small>
          </div>
          <div>
            <small>
              <Link to="https://creativecommons.org/publicdomain/zero/1.0/deed.zh" target="_blank" rel="noreferrer">CC0</Link> © 公共领域
            </small>
          </div>
        </footer>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
