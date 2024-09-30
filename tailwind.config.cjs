/**
 * @type {import("tailwindcss").Config}
 */
module.exports = {
  content: [
    "./app/**/*.tsx",
    //
    "./public/rss.xsl",
    //
    "./stories/**/*.tsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@iconify/tailwind").addDynamicIconSelectors(),
    require("@catppuccin/tailwindcss")({
      prefix: "cat",
      // defaultFlavour: "mocha",
    }),
  ],
  experimental: {
    optimizeUniversalDefaults: true,
  },
};
