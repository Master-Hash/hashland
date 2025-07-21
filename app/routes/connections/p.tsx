"use client";

import { Application } from "pixi.js";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { clientOnly$ } from "vite-env-only/macros";
import { loadTexture, unloadTexture } from "./loadtexture.js";
// import { reserveMemory } from "./rapier2d/exports.js";
import { World } from "./rapier2d/pipeline/world.js";
import init, { initThreadPool, version } from "./rapier2d/rapier_wasm2d.js";
// import { init, version, World } from "@dimforge/rapier2d-simd-compat";
import { setup } from "./systemes.js";

let _inited_thread_pool = false;

export function Pixi() {
  const [searchParams] = useSearchParams();
  const ref = useRef<HTMLCanvasElement>(null);
  const refContainer = useRef<HTMLDivElement>(null);
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
      // const c = ref.current!.transferControlToOffscreen();
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
          preference: "webgpu",
          canvas: ref.current!,
          // canvas: canvasContainer!,
          // resizeTo: refContainer.current!,
          width: refContainer.current!.clientWidth,
          height: refContainer.current!.clientHeight,
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
        Promise.all([
          promise,
          loadTexture(searchParams.get("noto") !== "0"),
          _inited_thread_pool ||
          searchParams.get("thread") === "0" ||
          import.meta.env.DEV
            ? init()
            : init().then((wasm) =>
                initThreadPool(
                  searchParams.get("thread")
                    ? parseInt(searchParams.get("thread")!)
                    : navigator.hardwareConcurrency,
                ).then(() => {
                  _inited_thread_pool = true;
                  return wasm;
                }),
              ),
        ])
          // .then(([app, texture, _RAPIER]) => {
          .then(([app, texture, _wasm]) => {
            console.log(version());
            console.info(_wasm);
            // reserveMemory(1024 * 1024 * 10); // 10 MiB
            // globalThis.w = _wasm;
            // console.log(RAPIER);
            // if (import.meta.env.DEV) {
            // @ts-expect-error for debug
            globalThis.__PIXI_APP__ = app;
            // }
            world = new World({ x: 0, y: 0 });
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
        Promise.all([
          promise,
          loadTexture(searchParams.get("noto") !== "0"),
          import("./pixi.ts"),
        ])
          .then(([app, texture, p]) => {
            // if (import.meta.env.DEV) {
            // @ts-expect-error for debug
            globalThis.__PIXI_APP__ = app;
            // }
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
    <section className="h-52" ref={refContainer}>
      <canvas ref={ref} />
    </section>
  );
}
