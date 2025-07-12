# Hashland

个人网站的前端部分。并非搭建网站的通用工具，如果只是希望自行搭建站点，不必考虑使用此仓库。技术栈可以从 `package.json` 和代码里看出，应当不言自明。希望具体实现能启发读者。

很多重要的部分没有提交，因此本地运行会有困难，也正因此本项目没有 CI。未提交内容主要是二进制文件和其他项目的编译产物，为此我将其列举如下：

* `react-router` 包：我为测试版 RSC 添加了 nonce 功能，用 `babel-plugin-react-compiler` 编译，并使用新的 jsx 转换。[源码见此](https://github.com/Master-Hash/react-router/tree/rsc/packages/react-router)。
* 需要注意，应用本身暂时与 `babel-plugin-react-compiler` 不兼容。
* 需要注意，我不再使用 `@react-router/dev` 包。

React Router 组件相当解耦，版本不一致一般没问题，但新功能中可能导致神秘的行为。

`/post-test/`：文章仓库，内有分为四个类别的 Markdown 文档和一些散落在根目录的文档。

`/public/zodiac-white.png`：带有月份图标的黄道圈。源代码见 `/app/routes/zodiac[.]svg.tsx`，用 `rsvg-convert.exe year.svg -o zodiac-white.png` 生成 PNG 图像。`/favicon.svg` 类似，`/_favicon.ico` 是从 svg 用[此网站](https://realfavicongenerator.net/)生成的，我建议当传家宝用。

`/app/resources/palace-museum.avif`：略黄、粗糙、带草梗的一张纸张采样。素材提取自故宫博物院的[文华飞羽集](https://www.dpm.org.cn/Uploads/File/2024/06/08/%E6%96%87%E5%8D%8E%E9%A3%9E%E7%BE%BD%E9%9B%86-u666430e897e64.pdf)，用 `pdfimages.exe -all <PDF-file> <image-root>` 提取所有图片后，所有纸张图片应为同一采样的不同剪裁，取最大一张。avif 压缩方法忘了，jxl 是 `cjxl ./palace-museum.jpg -o palace-museum.jxl -e 10 --lossless_jpeg=0 -q 45`。

`/app/resources/count.v5.js`：GoatCounter 脚本，[原件](https://gc.zgo.at/count.v5.js)，[文档](https://www.goatcounter.com/help/countjs-versions)。也许可以 minify，需要在 `root.tsx` 里同步更改 [sha384 签名](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/SRI)。

`/app/resources/shiwake.html`：[gzip 炸弹](https://idiallo.com/blog/zipbomb-protection)。`dd if=/dev/zero bs=1G count=10 | gzip -c > 10GB.gz` 应当配合服务端妙妙配置使用。目的是整蛊爬虫，爬虫技术陈旧，所以没整 zstd 炸弹。此外，我发现[错误编码的 JPEG](https://www.ty-penguin.org.uk/~auj/blog/2025/03/25/fake-jpeg/) 也很好玩。

`/app/resources/*.woff2`：从 Google Fonts 下载 Playfair，将其中可变字体转换为 woff2：`woff2_compress ./*.ttf`。感觉为了一个标点打包整个字体很亏，但算了。

`/public/{game-icons,fluent-emoji-high-contrast,...}`：在 [icônes](https://icones.js.org/) 下载图标包，手动把宽高调整至 256x256，颜色调为白色，再用 `rsvg-convert` 生成 PNG 图像。

`/public/assets/`：文章配图，不会影响前端编译。[文章仓库](https://github.com/Master-Hash/post-test/)有相关说明。

Bevy 游戏和 Rapier 物理引擎：分别从[此](https://github.com/Master-Hash/connections-rs)以及[此](https://github.com/Master-Hash/rapier.js/)仓库编译。Bevy 可以从 CI 下载工件，解压到路由模块目录即可；Rapier 也有工件可用，扔进路由目录的 rapier2d 子目录。

非二进制素材也有一些，但是来源显而易见，生成和格式转换方法是……我手写的。

D1 schema：在[这里](https://github.com/Master-Hash/discuss/blob/main/schema.sql)。本人可以导出生产环境的数据作 mock，读者应当各显神通。

另外，开发中的代码会由我手动编译并部署，但也不提交。2025年夏天，React Router 的服务端组件终于能用了！我大概是世界第一位把应用迁移过去的人。设计已经确定，我干脆把主分支改成了 vite。

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
