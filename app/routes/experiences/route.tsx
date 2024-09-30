// import { LoaderFunctionArgs, useLoaderData } from "react-router";
import type { MetaFunction } from "react-router";
import { HrefToLink } from "../../utils/components.js";
import P from "./experiences.md";

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: `故事 « 故人故事故纸堆` },
    // { name: "description", content: "Welcome to Remix!" },
    // 等人工智能来归纳
  ];
};

export default function Experiences() {
  return (
    <main className="prose relative mx-auto prose-a:whitespace-nowrap">
      <P
        components={{
          a: HrefToLink,
        }}
      />
    </main>
  );
}
