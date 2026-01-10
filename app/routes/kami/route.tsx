// import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { HrefToLink } from "../../utils/components.tsx";
import P from "./kami.md";

export default function Kami() {
  return (
    <main className="prose prose-a:whitespace-nowrap relative mx-auto">
      <title>故纸堆 « 故人故事故纸堆</title>
      <meta property="og:title" content="故纸堆 « 故人故事故纸堆" />
      <P
        components={{
          a: HrefToLink,
          // img: ImageCloudflareTransform,
        }}
      />
    </main>
  );
}
