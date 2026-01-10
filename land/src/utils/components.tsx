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

  if (href.includes(".md") && !href.includes("/")) {
    const o = path.split("/").slice(0, -1).join("/");
    // FIXME
    const newHref = (import.meta.env.SSR ? encodeURI(o) : o) + "/" + href;
    return (
      <a href={newHref} {...props}>
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
