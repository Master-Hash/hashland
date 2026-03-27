# atom

每次 `vite build` 时，从 `git log` 里提取历史以生成 RSS。本仓库是 Rust 部分。

## 逻辑

是写给 API 的提示。Vibe 初稿之后，我全面手动修订过，不保证下述逻辑反映现状。

* 读取 POST_PATH 仓库的 `git log`。
* 筛选 commit message 格式如 `feat(标题): 内容描述` 者，放弃包含 `!` 即 breaking change 者。
* 相同标题文章，取最新一个。
* 根据每次 commit 修改的文件（一般只有一个，过多时取第一个并警告），提取目录作为 URL（例如：a/b.md 对应 URL 是 `SITEURL + "a/b.md"`，不剥离最后的 `.md`）。
* 根据标题、内容描述、URL、commit 时间生成 RSS 条目。
* 用 napi-rs 将相同数据导出给 Node.js。

## 技术栈

* napi-rs
* gitoxide
* atom_syndication
