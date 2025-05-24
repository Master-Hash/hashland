/**
 * @import { UserConfig } from "vite";
 */
import { cloudflare } from "@cloudflare/vite-plugin";
import rsc from "@hiogawa/vite-rsc/plugin";
import chars from "@iconify-json/fluent-emoji-high-contrast/chars.json" with { type: "json" };
import { nodeTypes } from "@mdx-js/mdx";
import mdx from "@mdx-js/rollup";
import { transformerColorizedBrackets } from "@shikijs/colorized-brackets";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { transformerRenderWhitespace } from "@shikijs/transformers";
import { transformerTwoslash } from "@shikijs/twoslash";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-oxc";
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
import inspect from "vite-plugin-inspect";
import virtual from "vite-plugin-virtual";
import chronicles from "./app/routes/connections/chronicles.json" with { type: "json" };
// import { reactRouter } from "./framework/plugin.ts";
// import sonda from "sonda/vite";
// import babel from "vite-plugin-babel";
// import BabelPresetTypescript from "@babel/preset-typescript";
// import BabelPluginReactCompiler from "babel-plugin-react-compiler";

// babel({
//   filter: /\.[jt]sx?$/,
//   babelConfig: {
//     presets: [BabelPresetTypescript], // if you use TypeScript
//     plugins: [[BabelPluginReactCompiler, {}]],
//   },
// }),

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
  process.argv[1]?.includes("vite") && process.argv[2]?.includes("build");
// console.log(process.argv);

/** @type {UserConfig} */
export default {
  define: isBuild
    ? {
        "process.env.NODE_ENV": JSON.stringify(
          process.env.NODE_ENV || "production",
        ),
      }
    : {},
  resolve: isBuild
    ? {
        noExternal: true,
      }
    : {},
  // environments: {
  // client: {},
  // ssr: {
  //   resolve: {
  //     noExternal: true,
  //   },
  // },
  // rsc: {
  //   resolve: {
  //     noExternal: true,
  //   },
  // },
  // },
  plugins: [
    !isTypegen && tailwindcss(),
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
                  transformerRenderWhitespace(),
                  // toClass,
                ],
              },
            ],
          ],
        }),
        enforce: "pre",
      },
    // !isStorybook && !isTypegen && !isBuild && reactRouterCloudflareDevProxy(),
    // !isStorybook && reactRouter(),
    isBuild &&
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
        include: /\.(md|mdx|js|jsx|ts|tsx)$/,
        // babel: {
        //   // presets: [BabelPresetTypescript], // if you use TypeScript
        //   plugins: [[BabelPluginReactCompiler, {}]],
        // },
      }),
    !isStorybook &&
      !isTypegen &&
      rsc({
        entries: {
          browser: "./app/entry.browser.tsx",
          ssr: "./app/entry.ssr.tsx",
          rsc: "./app/entry.rsc.tsx",
        },
      }),
    // isTypegen && reactRouter(),
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
    inspect({
      // buggy on wasm
      // build: true,
    }),
    // !isStorybook && !isTypegen && sonda(),
  ],
  optimizeDeps: {
    holdUntilCrawlEnd: false,
    exclude: [],
    include: ["react/compiler-runtime", "react-router/dom"],
  },
  build: {
    // sourcemap: true,
    // modulePreload: {
    //   polyfill: false,
    // },
    minify: "oxc",
    cssMinify: "lightningcss",
    target: "esnext",
    rollupOptions: {
      // experimental: {
      // strictExecutionOrder: false,
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
    // importGlobRestoreExtension: true,
  },
  server: {
    allowedHosts: ["raissa.hash.memorial"],
  },
};

// const css = toClass.getCSS();
