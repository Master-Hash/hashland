import nodeLoaderCloudflare from "@hiogawa/node-loader-cloudflare/vite";
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
import { defineConfig, type VitePlugin } from "waku/config";

import chronicles from "./src/components/connections/chronicles.json" with { type: "json" };
import { EMOJI_REGEX } from "./src/utils/constant.ts";

const isBuild =
  process.argv[1]?.includes("vite") && process.argv[2]?.includes("build");

//#region shiki
enableDeprecationWarnings(true, true);
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

const hashShikiPlugin = {
  name: "hash:shiki-append-class-css",
  generateBundle(_, bundle) {
    const css = toClass.getCSS();
    for (const fileName in bundle) {
      if (Object.prototype.hasOwnProperty.call(bundle, fileName)) {
        const asset = bundle[fileName];
        if (asset.type === "asset" && fileName.endsWith(".css")) {
          console.log("\nAppending shiki class definition to", asset.fileName);
          // append the class CSS to the end of the CSS file
          asset.source += css + "\n";
          break;
        }
      }
    }
  },
} as VitePlugin;
//#endregion

//#region comptime
const _partialChars = chronicles.map((chronicle) => {
  if (chronicle.emoji.match(EMOJI_REGEX)) {
    // oxlint-disable-next-line no-misused-spread
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

function rgb(color: string): number {
  return parseInt(
    new Color(color).to("srgb").toString({ format: "hex" }).slice(1),
    16,
  );
}

const dark = {} as Record<string, number>;
const light = {} as Record<string, number>;

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
//#endregion

//#region mdx
const hashMDXPlugin = {
  ...mdx({
    format: "md",
    remarkPlugins: [
      remarkFrontmatter,
      () => {
        return (tree) => {
          let firstParagraph: string | undefined;

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
} as VitePlugin;
//#endregion

//#region waku
export default defineConfig({
  vite: {
    environments: {
      ssr: {
        build: {
          rollupOptions: {
            input: { "zodiac-module": "src/components/zodiac.tsx" },
          },
        },
      },
    },
    build: {
      // sourcemap: true,
      // minify: "oxc",
      minify: "esbuild",
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
      // enableNativePlugin: true,
      // skipSsrTransform: true,
      // importGlobRestoreExtension: true,
    },
    resolve: {
      alias: {
        "react-dom/server.browser": "react-dom/server.edge",
      },
    },
    optimizeDeps: {
      include: [
        "eventemitter3",
        "pixi.js",
        "parse-svg-path",
        "@xmldom/xmldom",
        "react/jsx-runtime",
      ],
    },
    plugins: [
      // isBuild && isoImport(),
      tailwindcss(),
      hashMDXPlugin,
      react({
        babel: {
          include: /\.(md|tsx?)$/,
          plugins: ["babel-plugin-react-compiler"],
        },
      }),
      nodeLoaderCloudflare({
        environments: ["rsc"],
        build: true,
        // https://developers.cloudflare.com/workers/wrangler/api/#getplatformproxy
        getPlatformProxyOptions: {
          persist: {
            path: ".wrangler/state/v3",
          },
        },
      }),
      virtual({
        "virtual:partial-chars": partialChars,
        "virtual:dark": dark,
        "virtual:light": light,
      }),
      // inspect({
      //   // buggy on wasm
      //   build: true,
      // }),
      hashShikiPlugin,
    ],
  },
});
//#endregion
