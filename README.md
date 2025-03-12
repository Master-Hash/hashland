# Hashland

个人网站的前端部分。并非搭建网站的通用工具，如果只是希望自行搭建站点，不必考虑使用此仓库。技术栈可以从 `package.json` 和代码里看出，应当不言自明。希望具体实现能启发读者。

很多重要的部分没有提交，因此本地运行会有困难。为此我将部署版本与仓库的区别列举如下：

* `react-router` 包：经过 `babel-plugin-react-compiler` 编译。
* `@react-router/dev` 包：内联了 `babel-plugin-react-compiler` 参见 [issue](https://github.com/remix-run/react-router/issues/12352)

React Router 组件相当解耦，版本不一致一般没问题，但新功能中可能导致神秘的行为。

`/post-test/`：文章仓库，内有分为四个类别的 Markdown 文档和一些散落在根目录的文档。

`/public/zodiac-white.png`：带有月份图标的黄道圈。源代码见 `/app/routes/zodiac[.]svg.tsx`，用 `rsvg-convert.exe year.svg -o zodiac-white.png` 生成 PNG 图像。

`/app/resources/palace-museum.avif`：略黄、粗糙、带草梗的一张纸张采样。素材提取自故宫博物院的[文华飞羽集](https://www.dpm.org.cn/Uploads/File/2024/06/08/%E6%96%87%E5%8D%8E%E9%A3%9E%E7%BE%BD%E9%9B%86-u666430e897e64.pdf)，用 `pdfimages.exe -all <PDF-file> <image-root>` 提取所有图片后，所有纸张图片应为同一采样的不同剪裁，取最大一张；压缩方法随意，我可能更喜欢 jxl。

`/public/{game-icons,fluent-emoji-high-contrast,...}`：在 [icônes](https://icones.js.org/) 下载图标包，手动把宽高调整至 256x256，颜色调为白色，再用 `rsvg-convert` 生成 PNG 图像。

`/public/assets/`：文章配图，不会影响前端编译。[文章仓库](https://github.com/Master-Hash/post-test/)有相关说明。

Bevy 游戏和 Rapier 物理引擎：分别从[此](https://github.com/Master-Hash/connections-rs)以及[此](https://github.com/Master-Hash/rapier.js/)仓库编译。Bevy 可以从 CI 下载工件，解压到路由模块目录即可；Rapier 也有工件可用，扔进路由目录的 rapier2d 子目录。

D1 schema：在[这里](https://github.com/Master-Hash/discuss/blob/main/schema.sql)。本人可以导出生产环境的数据作 mock，读者应当各显神通。

另外，开发中的代码会由我手动编译并部署，但也不提交。我非常期待服务端组件稳定——这样很多设计就可以定下来了。

<!-- 也许可以写进 package.json？ -->
<!--
"vite": "npm:rolldown-vite@0.3.2",
"rolldown": "npm:rolldown@0.13.2-snapshot-f1e4907-20241004003254",
 -->
<!-- file:../../vite/packages/vite -->

<!-- 从 Atom 做起，慢慢加。

"react-router": "file:../../react-router/packages/react-router",
"@react-router/dev": "file:../../react-router/packages/react-router-dev",

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
