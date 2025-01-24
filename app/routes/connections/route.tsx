import { Application } from "pixi.js";
import { useEffect, useRef } from "react";
import type { MetaFunction } from "react-router";
import { useNavigate } from "react-router";
import { clientOnly$ } from "vite-env-only/macros";
import { HrefToLink } from "../../utils/components.js";
import P from "./connections.md";
import { pixiApp } from "./pixi.js";

export const meta: MetaFunction = () => {
  return [{ title: "朋友们 « 故人故事故纸堆" }];
};

// function MyComponent() {
//   useExtend({ Container, Sprite, Text });
//   const texture = useAsset({ src: "https://pixijs.com/assets/bunny.png" });
//   const isDark = useRef(false);
//   useEffect(() => {
//     isDark.current =
//       window.matchMedia &&
//       window.matchMedia("(prefers-color-scheme: dark)").matches;
//   }, []);
//   return (
//     <Application background={0xffffff}>
//       {texture && (
//         <sprite anchor={{ x: 0.5, y: 0.5 }} texture x={400} y={270} />
//       )}

//       <container x={400} y={330}>
//         <text anchor={{ x: 0.5, y: 0.5 }} text={"Hello World"} />
//       </container>
//     </Application>
//   );
// }

export default function Pixi() {
  const ref = useRef<HTMLDivElement>(null);
  const isDark = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    isDark.current =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  }, []);

  clientOnly$(
    useEffect(() => {
      // const fuck = new Application(); // It's not my fault!
      // fuck.destroy();
      const app = new Application();
      globalThis.__PIXI_APP__ = app;
      pixiApp(app, ref, isDark, navigate);
      return () => {
        app.destroy();
      };
    }, [navigate]),
  );

  return (
    <main className="prose prose-a:whitespace-nowrap relative mx-auto">
      {/* <MyComponent /> */}
      <section className="h-52" ref={ref}></section>
      <P
        components={{
          a: HrefToLink,
        }}
      />
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
