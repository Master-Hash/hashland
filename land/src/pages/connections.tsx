import { Suspense } from "react";

import P from "../components/connections/connections.md";
import { Pixi } from "../components/connections/p.tsx";

export default function PixiServer() {
  return (
    <main className="relative mx-auto prose select-none prose-a:whitespace-nowrap">
      <title>故人 « 故人故事故纸堆</title>
      <meta property="og:title" content="故人 « 故人故事故纸堆" />
      <Suspense
        fallback={<p className="grid h-52 place-items-center">正在加载……</p>}
      >
        <Pixi />
      </Suspense>
      <P />
    </main>
  );
}

export const getConfig = () => {
  return {
    render: "static",
    // render: "dynamic",
  } as const;
};
