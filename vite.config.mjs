import {
  unstable_cloudflarePreset as cloudflare,
  unstable_vitePlugin as remix,
} from "@remix-run/dev";
import forgetti from "vite-plugin-forgetti";

/** @type {import('vite').UserConfig} */
export default {
  plugins: [
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
