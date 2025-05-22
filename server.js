import { createRequestListener } from "@mjackson/node-fetch-server";
import compression from "compression";
import express from "express";

import server from "./dist/server/entry.rsc.js";
import ssr from "./dist/ssr/entry.ssr.js";

const app = express();

app.use(compression());
// app.use((req, res, next) => {
//   // console.log(req.path);
//   if (req.path === "/favicon.ico") {
//     if (req.headers.accept?.includes("image/svg+xml")) {
//       res.setHeader("Content-Type", "image/svg+xml");
//       next();
//     } else {
//       // redirect to _favicon.ico
//       res.redirect(301, "/_favicon.ico");
//     }
//   } else {
//     next();
//   }
// });
app.use(express.static("dist/client"));

app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.status(404);
  res.end();
});

app.use(
  createRequestListener((request) => {
    return ssr.fetch(request, {
      SERVER: {
        fetch(request) {
          return server.fetch(request);
        },
      },
    });
  }),
);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
