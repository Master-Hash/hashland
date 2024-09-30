import type { FC, ReactElement } from "react";
import { Fragment, useContext } from "react";
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
import { NonceContext } from "./utils/components.js";

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
      href: style,
      rel: "preload",
      as: "style",
    },
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
      <main className="prose relative mx-auto prose-a:break-words">
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
  const nonce = useContext(NonceContext); // 这一行没有编译到客户端，这是为什么？
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body className="cat-latte grid min-h-screen grid-rows-[auto_1fr_auto] bg-cat-base text-cat-text dark:cat-frappe print:block">
        <HeaderComponent />
        {children}
        <FooterComponent />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
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
          ["/experiences", "故事"],
          ["/kami", "故纸堆"],
        ].map(([pathname, text], index) => (
          <Fragment key={pathname}>
            <NavLink
              to={pathname}
              className={({ isActive }) =>
                (isActive
                  ? "font-semibold text-cat-text"
                  : "font-normal text-cat-text opacity-80 hover:opacity-100") +
                " rounded px-1 py-2 text-base"
              }
            >
              {text}
            </NavLink>
            ・{/* {index !== 2 ? "・" : ""} */}
          </Fragment>
        ))}
        <a
          href="https://rsshub.app/telegram/channel/hash_elbeszelese"
          // content-center
          // but now is not needed?
          className="p-2 text-[0px] opacity-80 hover:opacity-100"
          target="_blank"
          rel="noreferrer"
        >
          <span className="icon-[streamline--rss-symbol-solid] text-[1rem]" />
          RSS feed
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
