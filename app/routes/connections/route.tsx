import { Application, Assets } from "pixi.js";
import { useEffect, useRef } from "react";
import type { MetaFunction } from "react-router";
import { useNavigate } from "react-router";
import { clientOnly$ } from "vite-env-only/macros";
import { HrefToLink } from "../../utils/components.js";
import chronicles from "./chronicle.js";
import P from "./connections.md";
import { loadTexture } from "./loadtexture.js";
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
      const controller = new AbortController();
      const sectionContainer = ref.current;
      const app = new Application();
      const { promise, resolve, reject } = Promise.withResolvers<Application>();
      void app
        .init({
          backgroundAlpha: 0,
          antialias: true,
          roundPixels: true,
          autoDensity: true,
          resolution: window.devicePixelRatio,
          resizeTo: sectionContainer!,
          preference: "webgpu",
        })
        .then(() => resolve(app));
      controller.signal.addEventListener("abort", () => {
        // console.log("abort");
        reject(controller.signal.reason);
      });
      Promise.all([promise, loadTexture()])
        .then(([app, texture]) => {
          // if (import.meta.env.DEV) {
          // @ts-expect-error for debug
          globalThis.__PIXI_APP__ = app;
          // }
          sectionContainer!.appendChild(app.canvas);
          return pixiApp(app, isDark.current, navigate, texture);
        })
        .catch((error) => {
          console.log("Abort reason:", error);
        });

      // void pixiApp(app, ref, isDark, navigate);
      return () => {
        controller.abort("The component is unmounted");
        console.log("Point clean", app, app.renderer);

        // should unload bundle here

        // 事实上，严格模式下装卸速度极快，不一定会给充足时间 init 也没人 await 你
        // 经典异步 race condition
        // 我们就默认，要是没挂载上渲染器，就等于没初始化
        if (
          Object.prototype.hasOwnProperty.call(app, "renderer") &&
          app.renderer !== undefined
        ) {
          // console.log(app.screen);
          // console.log(sectionContainer);
          sectionContainer?.removeChild(app.renderer.canvas);
          // 覆盖 alias 的警告就不管了
          // 反正资源是顺利释放了
          // 你可以注意到，重新加载页面时是重新下载了图片的（从浏览器缓存，而不是压根没记录）
          void Assets.unload([
            "zodiac",
            ...chronicles.map((chronicle) => chronicle.emoji),
          ]);
          // console.log("Point 3");
          app.destroy();
        }
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
        <p>Oops! An error occurred! We&apos;ll auto refresh to fix it.</p>
      </main>
    </>
  );
};
