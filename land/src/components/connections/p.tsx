"use client";

import { Application, Assets } from "pixi.js";
import { use, useEffect, useRef } from "react";
import { useRouter } from "waku";

import { ShanghaiNowDateTime } from "../../utils/functions.ts";
import { isSafari } from "../../utils/functions.ts";
import { NOTO_BUNDLE, FLUENT_BUNDLE, MISC_BUNDLE } from "./loadtexture.js";
import { World } from "./rapier2d/pipeline/world.js";
import init, { initThreadPool, version } from "./rapier2d/rapier_wasm2d.js";
import { setup } from "./systemes.js";

let _inited_thread_pool = false;
let _wasm: ReturnType<typeof init>;

if (!import.meta.env.SSR) {
  _wasm = init();
  Assets.addBundle("noto", NOTO_BUNDLE);
  Assets.addBundle("fluent", FLUENT_BUNDLE);
  Assets.addBundle("misc", MISC_BUNDLE);
  void Assets.backgroundLoadBundle(["noto", "misc"]);
}

export function Pixi() {
  const { query } = useRouter();
  const ref = useRef<HTMLCanvasElement>(null);
  const refContainer = useRef<HTMLDivElement>(null);

  const searchParams = new URLSearchParams(query);

  const isDark = useRef(false);
  const s = ShanghaiNowDateTime();
  useEffect(() => {
    isDark.current =
      s.month === 4 && s.day === 9
        ? false
        : window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
  }, [s.day, s.month]);

  const isNoto = searchParams.get("noto") !== "0";
  const isSingleThread =
    _inited_thread_pool ||
    searchParams.get("thread") === "0" ||
    import.meta.env.DEV ||
    // https://github.com/RReverser/wasm-bindgen-rayon/issues/32
    (isSafari() && searchParams.get("thread") === null);

  if (!import.meta.env.SSR) {
    use(_wasm);
    // console.log(wasm);
    console.log(version());

    useEffect(() => {
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

      // 彩蛋：按键宏
      const DOLPHIN_CODE = ["d", "o", "l", "p", "h", "i", "n"];
      let userInput = [] as string[];
      const callback = (e: KeyboardEvent) => {
        userInput.push(e.key);

        // 2. 保持数组长度，只保留最近的 N 个按键（N = 秘籍长度）
        userInput = userInput.slice(-DOLPHIN_CODE.length);
        if (
          userInput.join(",").toLowerCase() ===
          DOLPHIN_CODE.join(",").toLowerCase()
        ) {
          app.stage.emit("dolphin");
        }
      };
      window.addEventListener("keydown", callback);

      function handler() {
        // console.log("abort");
        reject(controller.signal.reason);
      }
      controller.signal.addEventListener("abort", handler);
      Promise.all([
        promise,
        Assets.loadBundle([isNoto ? "noto" : "fluent", "misc"]),
        isSingleThread
          ? null
          : initThreadPool(
              searchParams.get("thread")
                ? parseInt(searchParams.get("thread")!)
                : Math.min(navigator.hardwareConcurrency, 2),
            ).then(() => {
              _inited_thread_pool = true;
            }),
      ])
        // .then(([app, texture, _RAPIER]) => {
        .then(([app, texture, _]) => {
          // globalThis.w = _wasm;
          // console.log(RAPIER);
          // if (import.meta.env.DEV) {
          // @ts-expect-error for debug
          globalThis.__PIXI_APP__ = app;
          const t = {
            ...(isNoto ? texture.noto : texture.fluent),
            ...texture.misc,
          };
          // }
          world = new World({ x: 0, y: 0 });
          // console.log(RAPIER);
          return setup({
            app,
            world,
            // textur e,
            texture: t,
            isDark: isDark.current,
          });
        })
        .catch((error) => {
          console.error("Abort reason:", error);
        });

      return () => {
        controller.abort("The component is unmounted");
        window.removeEventListener("keydown", callback);
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
            void Assets.unloadBundle([isNoto ? "noto" : "fluent", "misc"]);
          }
          // console.log("Point 3");
          app.destroy();
          if (world !== undefined) {
            world.free();
          }
          delete globalThis.__PIXI_APP__;
        }
      };
    }, [query]);
  }

  return (
    <section className="h-52" ref={refContainer}>
      <canvas ref={ref} />
    </section>
  );
}
