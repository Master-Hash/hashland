// "use client";

// import { isSafari } from "pixi.js";

// export async function loader({ request }: LoaderFunctionArgs) {
//   const ua = request.headers.get("user-agent") || "";
//   return { isSafari: /^((?!chrome|android).)*safari/i.test(ua) };
// }

export function NoSafari({ isSafari }: { isSafari: boolean }) {
  if (isSafari) {
    // console.log("fuck", isSafari);
    return <p>本游戏所用物理引擎只能在 Safari 26 或更高版上正确运行。</p>;
  } else {
    return null;
  }
}
