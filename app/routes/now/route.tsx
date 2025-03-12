// import { LoaderFunctionArgs, useLoaderData } from "react-router";
import type { MetaFunction } from "react-router";
import P from "../../../post-test/now.md";
import { HrefToLink } from "../../utils/components.tsx";

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: `近况 « 故人故事故纸堆` },
    // { name: "description", content: "Welcome to Remix!" },
    // 等人工智能来归纳
  ];
};

export default function Now() {
  return (
    <main className="prose relative mx-auto">
      <P
        components={{
          a: HrefToLink,
          // img: ImageCloudflareTransform,
        }}
      />
    </main>
  );
}
