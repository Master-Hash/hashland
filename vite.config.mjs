import BabelPresetTypescript from "@babel/preset-typescript";
/**
 * @import { UserConfig } from "vite";
// import { reactRouter } from "./framework/plugin.ts";
// import sonda from "sonda/vite";
// import babel from "vite-plugin-babel";
*/
import { cloudflare } from "@cloudflare/vite-plugin";
import chars from "@iconify-json/fluent-emoji-high-contrast/chars.json" with { type: "json" };
import { nodeTypes } from "@mdx-js/mdx";
import mdx from "@mdx-js/rollup";
import { transformerColorizedBrackets } from "@shikijs/colorized-brackets";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import {
  transformerRenderWhitespace,
  transformerStyleToClass,
} from "@shikijs/transformers";
import { transformerTwoslash } from "@shikijs/twoslash";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import BabelPluginReactCompiler from "babel-plugin-react-compiler";
import Color from "colorjs.io";
import { toString } from "mdast-util-to-string";
import process from "node:process";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import smartypants from "remark-smartypants";
import {
  enableDeprecationWarnings,
  getSingletonHighlighterCore,
} from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import getWasm from "shiki/wasm";
import { SKIP, visit } from "unist-util-visit";
import inspect from "vite-plugin-inspect";
import { isoImport } from "vite-plugin-iso-import";
import virtual from "vite-plugin-virtual";

import chronicles from "./app/routes/connections/chronicles.json" with { type: "json" };
import { EMOJI_REGEX } from "./app/utils/constant.ts";

// babel({
//   filter: /\.[jt]sx?$/,
//   babelConfig: {
//     presets: [BabelPresetTypescript], // if you use TypeScript
//     plugins: [[BabelPluginReactCompiler, {}]],
//   },
// }),

enableDeprecationWarnings(true, true);

const _partialChars = chronicles.map((chronicle) => {
  if (chronicle.emoji.match(EMOJI_REGEX)) {
    const codePoint = [...chronicle.emoji]
      .map((char) => char.codePointAt(0)?.toString(16))
      .join("-");
    return codePoint;
  } else {
    return null;
  }
});

const partialChars = Object.fromEntries(
  Object.entries(chars).filter(([key]) => {
    // console.log(key);
    return _partialChars.includes(key);
  }),
);

const SECOND_IN_TROPIC_YEAR = 31556926;

/**
 *
 * @param {string} color
 * @returns {number}
 */
function rgb(color) {
  return parseInt(
    new Color(color).to("srgb").toString({ format: "hex" }).slice(1),
    16,
  );
}

/**
 * @type {Record<string, number>}
 */
const dark = {};
/**
 * @type {Record<string, number>}
 */
const light = {};

chronicles.forEach((c) => {
  const date = new Date(c.date);
  const radian =
    ((date.valueOf() / 1000 - new Date("2024-01-01").valueOf() / 1000) /
      SECOND_IN_TROPIC_YEAR) *
    2 *
    Math.PI;
  dark[c.date] = rgb(`oklch(69% 0.1 ${4 - radian}rad)`);
  light[c.date] = rgb(`oklch(42% 0.1 ${4 - radian}rad)`);
});

// console.log(tmp);

const toClass = transformerStyleToClass({
  classPrefix: "__shiki_",
});

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

// let cnt = 0;

const isStorybook = process.argv[1]?.includes("storybook");
const isTypegen = process.argv[2]?.includes("typegen");
const isBuild =
  process.argv[1]?.includes("vite") && process.argv[2]?.includes("build");
// console.log(process.argv);

/** @type {UserConfig} */
export default {
  // define: {
  //   BUILD_DATE: new Date().toISOString(), // todo: use temporal
  // },
  // define: isBuild
  //   ? {
  //       "process.env.NODE_ENV": JSON.stringify(
  //         process.env.NODE_ENV || "production",
  //       ),
  //     }
  //   : {},
  environments: {
    client: {
      optimizeDeps: {
        include: ["react-router", "react-router/internal/react-server-client"],
      },
      build: {
        rolldownOptions: {
          output: {
            advancedChunks: {
              groups: [
                { name: "v--router", test: /\/react-router/ },
                { name: "v--react", test: /\/react(?:-dom)?(?!-router)/ },
                { name: "v--pixi", test: /\/pixi/ },
                { name: "v--cytoscape", test: /\/cytoscape/ },
              ],
            },
          },
        },
      },
    },
    ssr: {
      optimizeDeps: {
        include: [
          "react",
          "react/compiler-runtime",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
          "react-dom",
          "react-dom/server.edge",
          "react-router > cookie",
          "react-router > set-cookie-parser",
        ],
        exclude: ["react-router"],
      },
      build: {
        rolldownOptions: {
          // external: ["pixi.js"],
          platform: "neutral",
        },
      },
    },
    rsc: {
      optimizeDeps: {
        include: ["react-router > cookie", "react-router > set-cookie-parser"],
        exclude: ["react-router"],
      },
      build: {
        rolldownOptions: {
          // @ts-ignore rolldown
          platform: "neutral",
        },
      },
    },
  },
  plugins: [
    isBuild &&     isoImport(),
    !isTypegen && tailwindcss(),
    !isStorybook &&
      !isTypegen && {
        ...mdx({
          format: "md",
          remarkPlugins: [
            remarkFrontmatter,
            () => {
              return (tree) => {
                /**
                 * @type {string | undefined} firstParagraph
                 */
                let firstParagraph;

                visit(tree, "paragraph", (node) => {
                  if (!firstParagraph) {
                    firstParagraph = toString(node);
                  }
                  return SKIP;
                });
                visit(tree, "yaml", (node) => {
                  if (node.value) {
                    if (!node.value.includes("description:")) {
                      node.value += `\ndescription: ${firstParagraph}`;
                    }
                  }
                  return SKIP;
                });
              };
            },
            remarkMdxFrontmatter,
            smartypants,
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
                  transformerRenderWhitespace(),
                  toClass,
                ],
              },
            ],
          ],
        }),
        enforce: "pre",
      },
    // !isStorybook && !isTypegen && !isBuild && reactRouterCloudflareDevProxy(),
    // !isStorybook && reactRouter(),
    !isStorybook &&
      !isTypegen &&
      cloudflare({
        persistState: true,
        configPath: "./wrangler.toml",
        viteEnvironment: {
          name: "ssr",
        },
        auxiliaryWorkers: [
          {
            configPath: "./rsc.toml",
            viteEnvironment: {
              name: "rsc",
            },
          },
        ],
      }),
    // now React Compiler is not compatible with React Router RSC
    !isStorybook &&
      !isTypegen &&
      react({
        include: /\.(md|tsx)$/,
        // exclude: /react-router/,
        babel: {
          presets: [BabelPresetTypescript], // if you use TypeScript
          plugins: [
            [BabelPluginReactCompiler, { compilationMode: "annotation" }],
          ],
        },
      }),
    !isStorybook &&
      !isTypegen &&
      rsc({
        entries: {
          client: "./app/entry.browser.tsx",
          ssr: "./app/entry.ssr.tsx",
          rsc: "./app/entry.rsc.tsx",
        },
        serverHandler: false,
        useBuildAppHook: true,
      }),
    // isTypegen && reactRouter(),
    !isStorybook &&
      !isTypegen &&
      virtual({
        "virtual:partial-chars": partialChars,
        "virtual:dark": dark,
        "virtual:light": light,
      }),
    // Macros({
    //   // include: [/comptime\.[cm]?[jt]sx?$/],
    //   exclude: [
    //     /node_modules/,
    //     /\.d\.[cm]?ts$/,
    //     /connections-rs\.js/,
    //     /rapier_wasm2d\.js/,
    //   ],
    // }),
    // envOnlyMacros(),
    // arraybuffer(),
    inspect({
      // buggy on wasm
      build: true,
    }),
    {
      // 我担心，这玩意在开发环境下不会运行
      // 但是 rolldown 全打包开发就要出来了
      // 这马上就不是问题了，应该
      name: "hash:shiki-append-class-css",
      generateBundle(_, bundle) {
        const css = toClass.getCSS();
        for (const fileName in bundle) {
          if (Object.prototype.hasOwnProperty.call(bundle, fileName)) {
            const asset = bundle[fileName];
            if (asset.type === "asset" && fileName.endsWith(".css")) {
              console.log(
                "\nAppending shiki class definition to",
                asset.fileName,
              );
              // append the class CSS to the end of the CSS file
              asset.source += css + "\n";
              break;
            }
          }
        }
      },
    },
    // !isStorybook && !isTypegen && sonda(),
  ],
  build: {
    // sourcemap: true,
    minify: "oxc",
    cssMinify: "lightningcss",
    target: "esnext",
    assetsInlineLimit: 0,
    reportCompressedSize: false,
    modulePreload: {
      polyfill: false,
    },
  },
  worker: {
    format: "es",
  },
  experimental: {
    enableNativePlugin: true,
    // skipSsrTransform: true,
    // importGlobRestoreExtension: true,
  },
  resolve: {
    alias: {
      "react-dom/server.browser": "react-dom/server.edge",
    },
  },
  server: {
    allowedHosts: ["raissa.hash.moe"],
  },
};

// console.log(cnt);
