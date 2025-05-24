// @ts-check

import fs from "node:fs";
import path from "node:path";

{
  const files = fs.readdirSync("./dist/rsc/assets");

  files.forEach((/** @type {string} */ _file) => {
    const file = path.join("./dist/rsc/assets", _file);
    // console.log(`Processing: ${file}`);
    if (_file.startsWith("rsc-") && fs.statSync(file).isFile()) {
      let content = fs.readFileSync(file, "utf8");
      const index = content.indexOf("../client/");

      if (index !== -1) {
        const newContent =
          content.slice(0, index) +
          "" +
          content.slice(index + "../client/".length);
        fs.writeFileSync(file, newContent, "utf8");
        console.log(`Rewritten: ${file}`);
      }
    }
  });
}

{
  const files = fs.readdirSync("./dist/ssr");

  files.forEach((/** @type {string} */ _file) => {
    const file = path.join("./dist/ssr", _file);
    // console.log(`Processing: ${file}`);
    if (_file === "index.js" && fs.statSync(file).isFile()) {
      let content = fs.readFileSync(file, "utf8");
      const index = content.indexOf("../client/");

      if (index !== -1) {
        const newContent =
          content.slice(0, index) +
          "./" +
          content.slice(index + "../client/".length);
        fs.writeFileSync(file, newContent, "utf8");
        console.log(`Rewritten: ${file}`);
      }
    }
  });
}

fs.copyFileSync(
  "./dist/client/__vite_rsc_assets_manifest.js",
  "./dist/ssr/__vite_rsc_assets_manifest.js",
);

fs.copyFileSync(
  "./dist/client/__vite_rsc_assets_manifest.js",
  "./dist/rsc/__vite_rsc_assets_manifest.js",
);
