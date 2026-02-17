"use client";

import type { FC } from "react";

import { useRouter } from "waku";

export const HrefToLink: FC<{
  href: string;
  children: string;
  props: Record<string, unknown>;
}> = ({ href, children, ...props }) => {
  "use memo";
  const { path } = useRouter();
  // https://github.com/microsoft/typescript-go/blob/main/CHANGES.md#scanner
  if (
    href.match(/\.md(?=#|$)/) &&
    !href.startsWith("/") &&
    !href.startsWith("https")
  ) {
    // 虽然 path 的 encoding 有问题，但 new URL 会按需编码
    const u = new URL(path, import.meta.env.VITE_SITEURL);
    const a = new URL(href, u).pathname;
    return (
      <a href={a} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

export const ImageCloudflareTransform: FC<{
  src: string;
  props: Record<string, unknown>;
}> = ({ src, ...props }) => {
  "use memo";
  return import.meta.env.DEV ? (
    <img src={src} {...props} />
  ) : (
    <img src={"/cdn-cgi/image/f=auto,q=70" + src} {...props} />
  );
};
