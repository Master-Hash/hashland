import type { FC } from "react";
import { Link } from "react-router";

// https://github.com/zloirock/core-js/blob/master/packages/core-js/modules/web.url.parse.js
// Below is temporary polyfill
function parse(url: string): URL | null {
  try {
    return new URL(url);
  } catch (e) {
    return null;
  }
}

export const HrefToLink: FC<{
  href: string;
  children: string;
  props: Record<string, unknown>;
}> = ({ href, children, ...props }) => {
  const u = "parse" in URL ? (URL.parse(href) as URL) : parse(href);
  if (u)
    return u.hostname === new URL(import.meta.env.VITE_SITEURL).hostname ? (
      <Link
        to={{
          pathname: u.pathname,
          search: u.search,
          hash: u.hash,
        }}
      >
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  // 相同类型
  else if (href.endsWith(".md") && !href.includes("/")) {
    return (
      <Link to={`../${href}`} {...props} relative="path">
        {children}
      </Link>
    );
  } else
    return (
      <Link to={href} {...props}>
        {children}
      </Link>
    );
};
