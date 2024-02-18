import { nodeTypes } from "@mdx-js/mdx";
import mdx from "@mdx-js/rollup";
import {
  unstable_cloudflarePreset as cloudflare,
  unstable_vitePlugin as remix,
} from "@remix-run/dev";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { transformerRenderWhitespace } from "@shikijs/transformers";
import { transformerTwoslash } from "@shikijs/twoslash";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { getHighlighterCore } from "shiki/core";
import getWasm from "shiki/wasm";
import forgetti from "vite-plugin-forgetti";

const highlighter = await getHighlighterCore({
  themes: [
    // import("shiki/themes/vitesse-light.mjs"),
    // import("shiki/themes/vitesse-dark.mjs"),
    import("shiki/themes/catppuccin-latte.mjs"),
    import("shiki/themes/catppuccin-frappe.mjs"),
    // import("shiki/themes/catppuccin-macchiato.mjs"),
  ],
  langs: [
    import("shiki/langs/apache.mjs"),
    import("shiki/langs/shellscript.mjs"),
    import("shiki/langs/typescript.mjs"),
  ],
  loadWasm: getWasm,
});

/** @type {import('vite').UserConfig} */
export default {
  plugins: [
    mdx({
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
              transformerRenderWhitespace(),
            ],
          },
        ],
      ],
    }),
    remix({
      presets: [cloudflare()],
      future: {},
    }),
    forgetti({
      preset: "react",
      filter: {
        include: "app/**/*.{ts,js,tsx,jsx}",
        exclude: "node_modules/**/*.{ts,js,tsx,jsx}",
      },
    }),
  ],
  ssr: {
    resolve: {
      externalConditions: ["workerd", "worker"],
    },
  },
};
