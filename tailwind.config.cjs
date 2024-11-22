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
    //
    "./post-test/**/*.md",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Droid Sans Mono",
          "Liberation Mono",
          "Courier New",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
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
