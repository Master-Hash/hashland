import { Application } from "pixi.js";
import { useEffect, useRef } from "react";
import { useNavigate, type MetaFunction } from "react-router";
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

  useEffect(() => {
    // const fuck = new Application(); // It's not my fault!
    // fuck.destroy();
    const app = new Application();
    globalThis.__PIXI_APP__ = app;
    pixiApp(app, ref, isDark, navigate);
    return () => {
      app.destroy();
    };
  }, [navigate]);

  return (
    <main className="prose relative mx-6 dark:prose-invert md:mx-auto">
      {/* <MyComponent /> */}
      <section className="h-52" ref={ref}></section>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint numquam,
        laborum explicabo quae nihil ab eveniet tempora cupiditate perspiciatis
        ipsam fuga rem distinctio harum error officiis provident obcaecati ad
        cumque!
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem maxime
        sed consequatur eius vel corrupti repudiandae nulla sint molestias
        obcaecati aliquid, porro ullam labore amet doloremque eaque error. Vel,
        enim?
      </p>
    </main>
  );
}
