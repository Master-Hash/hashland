module.exports = (ctx) => ({
  map: ctx.options.map,
  plugins: {
    "postcss-import": { root: ctx.file.dirname },
    tailwindcss: {},
    autoprefixer: {},
    cssnano: ctx.env === "production" ? {} : false,
  },
});
