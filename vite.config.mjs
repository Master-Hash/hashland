import {
  unstable_cloudflarePreset as cloudflare,
  unstable_vitePlugin as remix,
} from "@remix-run/dev";

/** @type {import('vite').UserConfig} */
export default {
  plugins: [
    remix({
      presets: [cloudflare()],
    }),
  ],
  ssr: {
    resolve: {
      externalConditions: ["workerd", "worker"],
    },
  },
};
