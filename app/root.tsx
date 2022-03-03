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
import styles from "./main.css";

export const meta: MetaFunction = () => {
  return {
    title: "Hashland",
    "og:title": "Hashland",
    "og:image": "",
    "og:description": "()",
    "og:site_name": "Hashland",
    robots: "follow, index",
    description: "()",
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
        <header>
          <Link to="/">
            {/* <img src="/favicon.svg" alt="favicon" /> */}
            <span>Hashland</span>
          </Link>
          <nav>
          </nav>
        </header>
        <main><Outlet /></main>
        <footer>
          <small></small>
        </footer>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
