import {createEventHandler} from "@remix-run/cloudflare-workers";
import * as build from "@remix-run/dev/server-build";

addEventListener(
  "fetch",
  (event: FetchEvent) => {
    // console.log(event.request);
    createEventHandler({build, mode: process.env.NODE_ENV})(event);
  }
);
