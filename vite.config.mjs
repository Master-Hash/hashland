import { flavors } from "@catppuccin/palette";
import { nodeTypes } from "@mdx-js/mdx";
import mdx from "@mdx-js/rollup";
import shikiColorizedBrackets from "@michael-makes/shiki-colorized-brackets";
import {
  vitePlugin as reactRouter,
  cloudflareDevProxyVitePlugin as reactRouterCloudflareDevProxy,
} from "@react-router/dev";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { transformerRenderWhitespace } from "@shikijs/transformers";
import { transformerTwoslash } from "@shikijs/twoslash";
import process from "node:process";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { getSingletonHighlighterCore } from "shiki/core";
import getWasm from "shiki/wasm";
// import { envOnlyMacros } from "vite-env-only";
import babel from "vite-plugin-babel";
// import forgetti from "vite-plugin-forgetti";

const highlighter = await getSingletonHighlighterCore({
  themes: [
    // import("shiki/themes/vitesse-light.mjs"),
    // import("shiki/themes/vitesse-dark.mjs"),
    import("shiki/themes/catppuccin-latte.mjs"),
    import("shiki/themes/catppuccin-frappe.mjs"),
    // import("shiki/themes/catppuccin-macchiato.mjs"),
  ],
  langs: [
    import("shiki/langs/apache.mjs"),
    import("shiki/langs/python.mjs"),
    import("shiki/langs/haskell.mjs"),
    import("shiki/langs/shellscript.mjs"),
    import("shiki/langs/typescript.mjs"),
    import("shiki/langs/json.mjs"),
    import("shiki/langs/tsx.mjs"),
  ],
  loadWasm: getWasm,
});

const ReactCompilerConfig = {
  // sources: (/** @type {string} */ filename) => {
  //   const _filename = filename.replace(/\\/g, "/");
  //   return _filename.indexOf("app/routes/post.$.tsx") === -1;
  // },
};

const isStorybook = process.argv[1]?.includes("storybook");

/** @type {import('vite').UserConfig} */
export default {
  plugins: [
    !isStorybook && {
      ...mdx({
        format: "md",
        remarkPlugins: [
          remarkFrontmatter,
          remarkMdxFrontmatter,
          remarkGfm,
          remarkMath,
        ],
        remarkRehypeOptions: {
          allowDangerousHtml: true,
          footnoteLabel: "尾注",
          footnoteBackLabel(referenceIndex, rereferenceIndex) {
            return (
              "回到正文：" +
              (referenceIndex + 1) +
              (rereferenceIndex > 1 ? "-" + rereferenceIndex : "")
            );
          },
        },
        rehypePlugins: [
          [rehypeRaw, { passThrough: nodeTypes }],
          rehypeSlug,
          [rehypeKatex, { strict: true, output: "mathml" }],
          [
            rehypeShikiFromHighlighter,
            highlighter,
            {
              themes: {
                // light: "vitesse-light",
                // dark: "catppuccin-mocha",
                light: "catppuccin-latte",
                // dark: "catppuccin-macchiato",
                dark: "catppuccin-frappe",
              },
              defaultColor: false,
              transformers: [
                transformerTwoslash(),
                shikiColorizedBrackets({
                  defaultColor: false,
                  colors: {
                    light: [
                      flavors.latte.colors.red.hex,
                      flavors.latte.colors.peach.hex,
                      flavors.latte.colors.yellow.hex,
                      flavors.latte.colors.green.hex,
                      flavors.latte.colors.sapphire.hex,
                      flavors.latte.colors.lavender.hex,
                    ],
                    dark: [
                      flavors.frappe.colors.red.hex,
                      flavors.frappe.colors.peach.hex,
                      flavors.frappe.colors.yellow.hex,
                      flavors.frappe.colors.green.hex,
                      flavors.frappe.colors.sapphire.hex,
                      flavors.frappe.colors.lavender.hex,
                    ],
                  },
                }),
                transformerRenderWhitespace(),
              ],
            },
          ],
        ],
      }),
      // enforce: "pre",
    },
    !isStorybook && reactRouterCloudflareDevProxy(),
    !isStorybook &&
      reactRouter({
        // prerender: [
        // "/",
        // "/post/事/2010-09-01_循环.md",
        // "/post/事/2020-02-16_网课时期.md",
        // "/post/事/2021-12-18_演讲《茸雪》.md",
        // "/post/事/2022-04-01_擦肩上纽.md",
        // "/post/事/2022-07-12_环川之行.md",
        // "/post/事/2023-3-21_风沙与柳絮.md",
        // "/post/人/Donz.md",
        // "/post/人/Spheniscidae.md",
        // "/post/人/Xecades.md",
        // "/post/人/f.md",
        // "/post/人/hz.md",
        // "/post/人/junyu33.md",
        // "/post/人/l老师.md",
        // "/post/人/大学室友.md",
        // "/post/人/家母.md",
        // "/post/人/無極.md",
        // "/post/情思/MTF.md",
        // "/post/情思/人生的大书.md",
        // "/post/情思/信条.md",
        // "/post/情思/家属.md",
        // "/post/情思/愿望.md",
        // "/post/情思/朋友.md",
        // "/post/情思/渔夫.md",
        // "/post/情思/玩泥巴.md",
        // "/post/情思/现代性.md",
        // "/post/情思/理想主义.md",
        // "/post/情思/自然是个整体.md",
        // "/post/情思/记叙时间.md",
        // "/post/情思/记忆与 WeakMap.md",
        // "/post/情思/语义网.md",
        // "/post/情思/蹊径.md",
        // "/post/情思/骗子的故事.md",
        // "/post/物/Florence.md",
        // "/post/物/Word Power Made Easy.md",
        // "/post/物/仙海.md",
        // "/post/物/公共服务.md",
        // "/post/物/大学寝室.md",
        // "/post/物/头发.md",
        // "/post/物/家乡.md",
        // "/post/物/时间.md",
        // "/post/物/服务器.md",
        // "/post/物/梳子.md",
        // "/post/物/电子词典.md",
        // "/post/物/行.md",
        // "/post/物/衣.md",
        // "/post/物/铁罐喷雾.md",
        // ],
        future: {
          // unstable_singleFetch: true,
          // unstable_serverComponents: true,
        },
      }),
    !isStorybook &&
      babel({
        filter: /\.(?:[jt]sx?)$/,
        // I don't know why MDXContent isn't compiled
        // Anyway, I'll wait for RSC so there'll be no need for client bundle
        // filter: /\.(?:[jt]sx?|mdx?)$/,
        babelConfig: {
          presets: ["@babel/preset-typescript"], // if you use TypeScript
          plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
        },
      }),
    // envOnlyMacros(),
    // forgetti({
    //   preset: "react",
    //   filter: {
    //     include: "app/**/*.{ts,js,tsx,jsx}",
    //     exclude: "node_modules/**/*.{ts,js,tsx,jsx}",
    //   },
    // }),
  ],
  optimizeDeps: {
    holdUntilCrawlEnd: false,
    include: ["react/compiler-runtime", "react-router/dom"],
  },
  build: {
    assetsInlineLimit: 0,
    reportCompressedSize: false,
  },
};
