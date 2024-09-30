# Hashland

个人网站的前端部分。并非搭建网站的通用工具，如果只是希望自行搭建站点，不必考虑使用此仓库。技术栈可以从 `package.json` 和代码里看出，应当不言自明。希望具体实现能启发读者。

很多重要的部分没有提交，因此本地运行会有困难。为此我将部署版本与仓库的区别列举如下：

`react-router` 包：由[上游 dev 分支](https://github.com/remix-run/react-router/tree/dev)加上自己的工具链小补丁编译而来。请注意其他组件用的是 npm nightly 版本（同样基于 dev 分支），React Router 组件相当解耦，版本不一致一般没问题，但新功能中可能导致神秘的行为。

工具链补丁行为如下：
* 使用[新的 JSX 转换](https://zh-hans.legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)；
* 使用 [React Compiler](https://react.dev/learn/react-compiler)，最初只实际作用于少数组件和钩子，现在能编译的组件越来越多了。

<!-- 补丁不会改变运行时行为，因此可以催促官方快快发布 `@react-router/cloudflare`，这样就可以全部用发行包了。 -->

<!-- React Router 7 和 Babel 8 发布后，我将对比编译版和 npm 发行版的捆绑包大小。 -->

`/post-test/`：文章仓库，内有分为四个类别的 Markdown 文档和一些散落在根目录的文档。

`/public/zodiac-white.png`：带有月份图标的黄道圈。源代码见 `/app/routes/zodiac[.]svg.tsx`，用 `rsvg-convert.exe year.svg -o zodiac-white.png` 生成 PNG 图像。

`/public/{game-icons,fluent-emoji-high-contrast}`：在 [icônes](https://icones.js.org/) 下载图标包，手动把宽高调整至 256x256，再用 `rsvg-convert` 生成 PNG 图像。

`/public/assets/`：文章配图，不会影响前端编译。[文章仓库](https://github.com/Master-Hash/post-test/)有相关说明。

D1 schema：在[这里](https://github.com/Master-Hash/discuss/blob/main/schema.sql)。本人可以导出生产环境的数据作 mock，读者应当各显神通。

另外，开发中的代码会由我手动编译并部署，但也不提交。我非常期待服务端组件稳定——这样很多设计就可以定下来了。

<!-- 也许可以写进 package.json？ -->


<!-- 从 Atom 做起，慢慢加。

## 技术栈

前端框架：[Remix](https://remix.run/)

样式：[Tailwind CSS](https://tailwindcss.com/)

图标库：[heroicons](https://heroicons.com/)

部署：[Cloudflare Workers](https://workers.cloudflare.com/)

## 样式参考

```
blog.xecades.xyz
developer.mozilla.org
spencerwoo.com
deno.land
```

## Domain

```
.land  2018,2022-06-05T13:18:04Z
.town  2019,2022-09-21T19:25:28Z
.page  2020,2023-03-05T20:24:02Z
.quest 2021,2022-06-30T23:59:59.0Z
.cloud 2016,2023-02-11T01:48:25Z
.gold  2019,2022-08-24T23:38:43Z
```

## 模板 REAMDE
[cloudflare-workers](https://github.com/remix-run/remix/blob/main/templates/cloudflare-workers/README.md) -->
