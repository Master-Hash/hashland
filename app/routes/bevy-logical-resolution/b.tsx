"use client";

import { useEffect } from "react";
import { clientOnly$ } from "vite-env-only/macros";
import init from "./connections-rs.js";

export function Bevy() {
  clientOnly$(
    useEffect(() => {
      // (async () => {
      //   await init();
      //   greet();
      // })();
      void init().then((wasm) => {
        wasm.__wbindgen_start();
      });
      // wasm.greet();
      return () => {};
    }, []),
  );
  return <canvas id="mygame-canvas" className="!h-52 !w-full" />;
}

export function Err() {
  useEffect(() => {
    location.reload();
  }, []);
  // const error = useRouteError() as {
  //   status: number;
  //   statusText: string;
  //   internal: boolean;
  //   data: string;
  //   error: Error;
  // };
  // console.error(error);
  // useEffect(() => {
  //   console.error(error);
  // });
  return (
    <main className="prose prose-a:break-words relative mx-auto">
      <title>Client Error</title>
      <h1>Client Error</h1>
      <p>Oops! An error occurred! We&lsquoll auto refresh to fix it.</p>
    </main>
  );
}
