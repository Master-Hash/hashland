// import { Resources } from "@hiogawa/vite-rsc/rsc";
// import ry from "./resources/ry.js?url";
import { Outlet } from "react-router";

import "./main.css";

export { ErrorBoundary, Layout } from "./root.client.tsx";

export default function App() {
  return <Outlet />;
}

// export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
// const items = [
//   <p key={0}>
//     我有两位朋友擅长日语：<Link to="/人/無極.md">無極</Link>和{" "}
//     <Link to="/人/Alan.md">Alan</Link>。高三时我曾玩过一部美妙的歌剧{" "}
//     <a
//       href="https://store.steampowered.com/app/559210/Rakuen/"
//       target="_blank"
//       rel="noreferrer"
//     >
//       Rakuen
//     </a>
//     ，Alan 听说后指出汉字写作“X園”，無極听说汉字名“楽園”后则指出读音。
//   </p>,
//   <p key={1}></p>,
// ];
// const item = useState(Math.random());
// const error = useRouteError() as {
//   status: number;
//   statusText: string;
//   internal: boolean;
//   data: string;
//   error: Error;
// };
// console.error(error);
// return <ErrorReporter error={error} />;
// }
