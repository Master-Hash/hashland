import type { FC, ReactElement } from "react";
import { Outlet } from "react-router";
import type { Route } from "./+types/root.ts";
import style from "./main.css?url";
import {
  ErrorReporter,
  FooterComponent,
  HeaderComponent,
  WrappedScrollRestoration,
} from "./root.client.tsx";
// import style from "./main.css?url";
// 后者有 bug，会导致 client 和 server 的 css 双双被加载
// import { useNonce } from "./utils/components.tsx";

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

// export const loader = defineLoader(({ response }) => {
// export const loader = () => {
// response.headers.append(
//   "content-security-policy",
//   "default-src 'self'; style-src-attr 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval'; script-src-elem 'self' 'unsafe-inline'; worker-src 'self' blob:; img-src 'self' data: " +
//     (import.meta.env.DEV ? "" : ""),
// );
// return {nonce};
// };

// export const headers: HeadersFunction = () => ({});

export default function App() {
  return <Outlet />;
}

export const Layout: FC<{
  children: ReactElement;
}> = ({ children }) => {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" type="image/svg+xml" />
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
          href="https://github.com/Master-Hash/hashland/commits/main.atom"
          title="Recent Commits to hashland:main"
        />
        {/* <Links /> */}
      </head>
      <body className="bg-cat-base text-cat-text grid min-h-screen grid-rows-[auto_1fr_auto] print:block">
        <HeaderComponent />
        {children}
        <FooterComponent />
        <WrappedScrollRestoration />
        {/* <Scripts nonce={nonce} /> */}
        {/* Cloudflare Web Analytics */}
        {/* <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "7f3186f1aa024cc38438e5416264242e"}'
        /> */}
        {/* End Cloudflare Web Analytics */}
      </body>
    </html>
  );
};

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
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
  return <ErrorReporter error={error} />;
}
