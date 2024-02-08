import mdx from "@mdx-js/rollup";
import {
  unstable_cloudflarePreset as cloudflare,
  unstable_vitePlugin as remix,
} from "@remix-run/dev";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import forgetti from "vite-plugin-forgetti";

/** @type {import('vite').UserConfig} */
export default {
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
    }),
    remix({
      presets: [cloudflare()],
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
