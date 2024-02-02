import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import type { FC, ReactElement } from "react";
import { StrictMode } from "react";

import { ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules.js";
import "./main.css";

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
      href: "/favicon.svg",
      type: "image/svg+xml",
    },
    {
      rel: "alternate",
      type: "application/rss+xml",
      href: "/pub.xml",
      title: "Hash's Publications",
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
    <BodyComponent>
      <Outlet />
    </BodyComponent>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = () => {
  const error = useRouteError() as {
    status: number;
    statusText: string;
    internal: boolean;
    data: string;
    error: Error;
  };
  console.error(error);
  return (
    <BodyComponent
      extraMeta={<title>{`${error.status} ${error.statusText}`}</title>}
    >
      {
        <article className="prose mx-8 dark:prose-invert md:mx-auto">
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
        </article>
      }
    </BodyComponent>
  );
  if (isRouteErrorResponse(error)) {
  }
};

// export const CatchBoundary: CatchBoundaryComponent = () => {
//   const caught = useCatch();
//   console.log(caught);
//   return (
//     <html>
//       <head>
//         <title>
//           {caught.status} {caught.statusText}
//         </title>
//         <meta charSet="utf-8" />
//         <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
//         <meta name="viewport" content="width=device-width,initial-scale=1.0" />
//         <meta
//           property="og:title"
//           content={`${caught.status} ${caught.statusText}`}
//         />
//         <meta
//           name="description"
//           content={`${caught.status} ${caught.statusText}`}
//         />
//         <meta
//           property="og:description"
//           content={`${caught.status} ${caught.statusText}`}
//         />
//         <Meta />
//         <Links />
//       </head>
//       <body className="dark:bg-zinc-800">
//         <HeaderComponent />
//         <main className="">
//           <article className="prose mx-auto dark:prose-invert">
//             <h1>
//               {caught.status} {caught.statusText}
//             </h1>
//             {caught.status === 404 ? (
//               <p>
//                 <a
//                   href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/404"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   404
//                 </a>
//                 属于客户端错误。你从哪里来，到哪里去，你想清楚了吗？
//               </p>
//             ) : caught.status === 400 ? (
//               <p>
//                 请指定搜索参数：<code>/search?q=%s</code>
//               </p>
//             ) : (
//               <p>{caught.data}</p>
//             )}
//           </article>
//         </main>
//         <FooterComponent />
//         <Scripts />
//       </body>
//     </html>
//   );
// };

const BodyComponent: FC<{
  children: ReactElement;
  extraMeta?: ReactElement;
}> = ({ children, extraMeta }) => {
  return (
    <StrictMode>
      <html lang="zh-cn">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1.0"
          />
          <Meta />
          {extraMeta}
          <Links />
        </head>
        <body className="cat-latte grid min-h-screen grid-rows-[auto_1fr_auto] bg-cat-base text-cat-text dark:cat-macchiato">
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
              alt="Hashland cube logo"
              src="/favicon.svg"
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
    <footer className="mx-auto p-4 text-center text-cat-subtext1 print:hidden">
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
            href="https://github.com/Master-Hash/post"
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
