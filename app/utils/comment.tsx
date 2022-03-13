import { Giscus } from "@giscus/react";

export function Comment() {
  return (
    <Giscus
      repo="Master-Hash/post"
      repoId="R_kgDOG5X2eQ"
      category="Announcements"
      categoryId="DIC_kwDOG5X2ec4COE4Z"
      mapping="pathname"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="bottom"
      theme="preferred_color_scheme"
      lang="zh-CN"
    />
  );
}
