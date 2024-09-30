import { flavors } from "@catppuccin/palette";
import { nodeTypes } from "@mdx-js/mdx";
import mdx from "@mdx-js/rollup";
import shikiColorizedBrackets from "@michael-makes/shiki-colorized-brackets";
import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy as reactRouterCloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
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
import {
  enableDeprecationWarnings,
  getSingletonHighlighterCore,
} from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import getWasm from "shiki/wasm";
// import wasm from "vite-plugin-wasm";
// import { envOnlyMacros } from "vite-env-only";
import babel from "vite-plugin-babel";
// import forgetti from "vite-plugin-forgetti";

enableDeprecationWarnings(true);

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
  engine: createOnigurumaEngine(getWasm),
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
    // !isStorybook && wasm(),
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
