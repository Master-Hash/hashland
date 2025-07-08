import { HrefToLink } from "../../utils/components.js";
import P from "./connections.md";
import { NoSafari } from "./nosafari.tsx";
import { Pixi } from "./p.tsx";

export default function PixiServer() {
  return (
    <main className="prose prose-a:whitespace-nowrap relative mx-auto select-none">
      <title>故人 « 故人故事故纸堆</title>
      {/* <MyComponent /> */}
      <Pixi />
      <NoSafari />
      <P
        components={{
          a: HrefToLink,
        }}
      />
    </main>
  );
}

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
