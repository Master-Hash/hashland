/**
 * @import { UserConfig } from "vite";
 */
import chars from "@iconify-json/fluent-emoji-high-contrast/chars.json" with { type: "json" };
import { nodeTypes } from "@mdx-js/mdx";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy as reactRouterCloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import { transformerColorizedBrackets } from "@shikijs/colorized-brackets";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { transformerRenderWhitespace } from "@shikijs/transformers";
import { transformerTwoslash } from "@shikijs/twoslash";
import tailwindcss from "@tailwindcss/vite";
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
import { envOnlyMacros } from "vite-env-only";
import virtual from "vite-plugin-virtual";
import chronicles from "./app/routes/connections/chronicles.json" with { type: "json" };
// import topLevelAwait from "vite-plugin-top-level-await";
// import wasm from "vite-plugin-wasm";
// import { envOnlyMacros } from "vite-env-only";
// import tailwindPostcss from "@tailwindcss/postcss";
// import babel from "vite-plugin-babel";
// import forgetti from "vite-plugin-forgetti";
// import BabelPresetTypescript from "@babel/preset-typescript";
// import BabelPluginReactCompiler from "babel-plugin-react-compiler";

enableDeprecationWarnings(true, true);

const partialChars = chronicles.map((chronicle) => {
  if (chronicle.emoji.match(/[\p{RGI_Emoji}\u26f0]/v)) {
    const codePoint = [...chronicle.emoji]
      .map((char) => char.codePointAt(0)?.toString(16))
      .join("-");
    return codePoint;
  } else {
    return null;
  }
});

// const toClass = transformerStyleToClass({
//   classPrefix: "__shiki_",
// });

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

const isStorybook = process.argv[1]?.includes("storybook");
const isTypegen = process.argv[2]?.includes("typegen");
const isBuild =
  process.argv[1]?.includes("@react-router") &&
  process.argv[2]?.includes("build");
// console.log(process.argv);

/** @type {UserConfig} */
export default {
  plugins: [
    !isStorybook &&
      !isTypegen && {
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
                  transformerColorizedBrackets(),
                  // shikiColorizedBrackets({
                  //   defaultColor: false,
                  //   colors: {
                  //     light: [
                  //       flavors.latte.colors.red.hex,
                  //       flavors.latte.colors.peach.hex,
                  //       flavors.latte.colors.yellow.hex,
                  //       flavors.latte.colors.green.hex,
                  //       flavors.latte.colors.sapphire.hex,
                  //       flavors.latte.colors.lavender.hex,
                  //     ],
                  //     dark: [
                  //       flavors.frappe.colors.red.hex,
                  //       flavors.frappe.colors.peach.hex,
                  //       flavors.frappe.colors.yellow.hex,
                  //       flavors.frappe.colors.green.hex,
                  //       flavors.frappe.colors.sapphire.hex,
                  //       flavors.frappe.colors.lavender.hex,
                  //     ],
                  //   },
                  // }),
                  transformerRenderWhitespace(),
                  // toClass,
                ],
              },
            ],
          ],
        }),
        // enforce: "pre",
      },
    !isStorybook && !isTypegen && !isBuild && reactRouterCloudflareDevProxy(),
    !isStorybook && reactRouter(),
    !isTypegen && tailwindcss(),
    !isStorybook &&
      !isTypegen &&
      virtual({
        "virtual:partial-chars": Object.fromEntries(
          Object.entries(chars).filter(([key]) => {
            return partialChars.includes(key);
          }),
        ),
      }),
    envOnlyMacros(),
  ],
  optimizeDeps: {
    holdUntilCrawlEnd: false,
    include: ["react/compiler-runtime", "react-router/dom"],
  },
  build: {
    target: "esnext",
    rollupOptions: {
      // experimental: {
      //   // strictExecutionOrder: false,
      // },
      // output: {
      //   target: "esnext",
      //   // advancedChunks: {},
      // },
    },
    assetsInlineLimit: 0,
    reportCompressedSize: false,
  },
  experimental: {
    // skipSsrTransform: true,
    // enableNativePlugin: true,
  },
  css: {
    postcss: {
      // plugins: [tailwindPostcss],
    },
  },
};

// const css = toClass.getCSS();
