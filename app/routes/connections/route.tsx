import { Application } from "pixi.js";
import { useEffect, useRef } from "react";
import type { MetaFunction } from "react-router";
import { useNavigate, useSearchParams } from "react-router";
import { clientOnly$ } from "vite-env-only/macros";
import { HrefToLink } from "../../utils/components.js";
import P from "./connections.md";
import { loadTexture, unloadTexture } from "./loadtexture.js";
import { World } from "./rapier2d/pipeline/world.js";
import init from "./rapier2d/rapier_wasm2d.js";
import { setup } from "./systemes.js";

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
  const [searchParams] = useSearchParams();
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
      // void import("@dimforge/rapier2d").then((RAPIER) => {
      //   // Use the RAPIER module here.
      //   const gravity = { x: 0.0, y: -9.81 };
      //   const world = new World(gravity);

      //   // Create the ground
      //   const groundColliderDesc = ColliderDesc.cuboid(10.0, 0.1);
      //   world.createCollider(groundColliderDesc);

      //   // Create a dynamic rigid-body.
      //   const rigidBodyDesc = RigidBodyDesc.dynamic().setTranslation(
      //     0.0,
      //     1.0,
      //   );
      //   const rigidBody = world.createRigidBody(rigidBodyDesc);

      //   // Create a cuboid collider attached to the dynamic rigidBody.
      //   const colliderDesc = ColliderDesc.cuboid(0.5, 0.5);
      //   const collider = world.createCollider(colliderDesc, rigidBody);
      //   console.log(collider.mass(), rigidBody.mass());

      //   // Game loop. Replace by your own game loop system.
      //   const gameLoop = () => {
      //     // Step the simulation forward.
      //     world.step();

      //     // Get and print the rigid-body's position.
      //     const position = rigidBody.translation();
      //     console.log("Rigid-body position: ", position.x, position.y);

      //     setTimeout(gameLoop, 16);
      //   };

      //   gameLoop();
      // });
      const controller = new AbortController();
      const sectionContainer = ref.current;
      const app = new Application();
      const { promise, resolve, reject } = Promise.withResolvers<Application>();
      let world: World;

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
      function handler() {
        // console.log("abort");
        reject(controller.signal.reason);
      }
      controller.signal.addEventListener("abort", handler);
      // if (import.meta.env.DEV) {
      if (searchParams.get("legacy") === null) {
        // Promise.all([promise, loadTexture(), init()])
        // Promise.all([promise, loadTexture(), import("@dimforge/rapier2d")])
        Promise.all([promise, loadTexture(), init()])
          // .then(([app, texture, _RAPIER]) => {
          .then(([app, texture, _wasm]) => {
            // console.log(_version());
            // console.log(RAPIER);
            // if (import.meta.env.DEV) {
            // @ts-expect-error for debug
            globalThis.__PIXI_APP__ = app;
            // }
            world = new World({ x: 0, y: 0 });
            sectionContainer!.appendChild(app.canvas);
            // console.log(RAPIER);
            return setup({
              app,
              world,
              texture,
              isDark: isDark.current,
              navigate,
            });
          })
          .catch((error) => {
            console.log("Abort reason:", error);
          });
      } else {
        Promise.all([promise, loadTexture(), import("./pixi.ts")])
          .then(([app, texture, p]) => {
            // if (import.meta.env.DEV) {
            // @ts-expect-error for debug
            globalThis.__PIXI_APP__ = app;
            // }
            sectionContainer!.appendChild(app.canvas);
            return p.pixiApp(app, isDark.current, navigate, texture);
          })
          .catch((error) => {
            console.log("Abort reason:", error);
          });
      }
      // void pixiApp(app, ref, isDark, navigate);
      return () => {
        controller.abort("The component is unmounted");
        controller.signal.removeEventListener("abort", handler);
        console.log("Point clean", app, app.renderer);

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

          // 资源顺利释放了
          // 你可以注意到，重新加载页面时是重新下载了图片的（从浏览器缓存，而不是压根没记录）
          // 实际上这里依然存在竞态，快速切换时可能第一次卸载还没完成，第二次加载就开始了
          // 但谁点这么快……
          // 如果真有人反馈问题，我就不卸载了！
          if (import.meta.env.PROD) {
            void unloadTexture();
          }
          // console.log("Point 3");
          app.destroy();
          if (world !== undefined) {
            world.free();
          }
          delete globalThis.__PIXI_APP__;
        }
      };
    }, [navigate, searchParams]),
  );

  return (
    <main className="prose prose-a:whitespace-nowrap relative mx-auto select-none">
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
