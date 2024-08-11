import type { FC, ReactElement } from "react";
import { StrictMode } from "react";
import type { HeadersFunction, LinksFunction } from "react-router";
import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";

// import "./main.css";
import style from "./main.css?url";

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
    {
      rel: "icon",
      href: "/favicon.ico",
      type: "image/svg+xml",
    },
    // {
    //   rel: "alternate",
    //   type: "application/rss+xml",
    //   href: "/pub.xml",
    //   title: "Hash's Publications",
    // },
    {
      rel: "alternate",
      type: "application/rss+xml",
      href: "https://rsshub.app/telegram/channel/hash_elbeszelese",
      title: "Hash Elbeszélése & Kívánsága",
    },
    {
      rel: "stylesheet",
      href: style,
    },
    // {
    //   rel: "search",
    //   type: "application/opensearchdescription+xml",
    //   title: "Hashland",
    //   href: `${SITEURL}/osd`,
    // }
  ];
};

// export const loader = defineLoader(({ response }) => {
// export const loader = ({ response }) => {
//   response.headers.append(
//     "content-security-policy",
//     "default-src 'self'; style-src-attr 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval'; script-src-elem 'self' 'unsafe-inline'; worker-src 'self' blob:; img-src 'self' data: " +
//       (import.meta.env.DEV ? "" : ""),
//   );
//   return null;
// };

export const headers: HeadersFunction = () => ({
  "content-security-policy":
    "default-src 'self'; style-src-attr 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval'; script-src-elem 'self' 'unsafe-inline'; worker-src 'self' blob:; img-src 'self' data: " +
    (import.meta.env.DEV ? "" : ""),
});

export default function App() {
  return <Outlet />;
}

export const ErrorBoundary = () => {
  const error = useRouteError() as {
    status: number;
    statusText: string;
    internal: boolean;
    data: string;
    error: Error;
  };
  // console.error(error);
  return (
    // https://react.dev/reference/react-dom/components/title#special-rendering-behavior
    // react@canary 会把 <meta> <title> 等自动插入 <head>
    // 期待 Remix 的 <Meta> <Link> 如何相应更改——把逻辑移入底层是好的
    <>
      <title>{`${error.status} ${error.statusText}`}</title>
      <main className="prose relative mx-6 dark:prose-invert prose-a:break-words md:mx-auto">
        <h1>{`${error.status} ${error.statusText}`}</h1>
        {error.status === 404 ? (
          <p>
            <a
              href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/404"
              target="_blank"
              rel="noreferrer"
            >
              404
            </a>
            属于客户端错误。你从哪里来，到哪里去，你想清楚了吗？
          </p>
        ) : (
          <p>{error.data}</p>
        )}
      </main>
    </>
  );
  // if (isRouteErrorResponse(error)) {
  // }
};

export const Layout: FC<{
  children: ReactElement;
}> = ({ children }) => {
  return (
    <StrictMode>
      <html lang="zh-CN">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1.0"
          />
          <Meta />
          <Links />
        </head>
        <body className="cat-latte grid min-h-screen grid-rows-[auto_1fr_auto] bg-cat-base text-cat-text dark:cat-frappe print:block">
          <HeaderComponent />
          {children}
          <FooterComponent />
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </StrictMode>
  );
};

function HeaderComponent() {
  return (
    <header className="px-8 py-4 print:hidden">
      <nav className="flex items-center space-x-2">
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
          ["/posts", "文章"],
          ["/collections", "专栏"],
          ["/friends", "友链"],
        ].map(([pathname, text]) => (
          <NavLink
            key={pathname}
            to={pathname}
            className={({ isActive }) =>
              (isActive
                ? "font-semibold"
                : "font-normal opacity-80 hover:opacity-100") +
              " rounded p-2 text-base"
            }
          >
            {text}
          </NavLink>
        ))}
        <a
          href="/atom"
          className="flex items-center p-2 opacity-80 hover:opacity-100"
          target="_blank"
          rel="noreferrer"
        >
          <span className="icon-[streamline--rss-symbol-solid]" />
        </a>
      </nav>
    </header>
  );
}

function FooterComponent() {
  return (
    <footer className="mx-auto p-4 pt-12 text-center text-cat-subtext1 print:hidden">
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
    </footer>
  );
}
