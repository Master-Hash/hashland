import { useEffect } from "react";
import type { MetaFunction } from "react-router";
import { clientOnly$ } from "vite-env-only/macros";
import init from "./connections-rs.js";

export const meta: MetaFunction = () => {
  return [{ title: "示例：逻辑分辨率 « 故人故事故纸堆" }];
};

export default function ConnectionsRs() {
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

  return (
    <main className="prose prose-a:whitespace-nowrap relative mx-auto">
      <canvas id="mygame-canvas" className="!h-52 !w-full"></canvas>
      <p>
        不定时重新编译。我目前不大可能用 bevy
        重写完整应用，但我会保留此示例以测试读者设备的分辨率，我的
        CI，以及未来的平台和应用特性。
        <a href="https://bevyengine.org/examples/window/window-resizing/">
          源代码
        </a>
        。
      </p>
    </main>
  );
}

export const ErrorBoundary = () => {
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
    <>
      <title>Client Error</title>
      <main className="prose prose-a:break-words relative mx-auto">
        <h1>Client Error</h1>
        <p>Oops! An error occurred! We&lsquoll auto refresh to fix it.</p>
      </main>
    </>
  );
};
