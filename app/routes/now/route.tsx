// import { LoaderFunctionArgs, useLoaderData } from "react-router";
import P from "../../../post-test/now.md";
import { HrefToLink } from "../../utils/components.tsx";

export default function Now() {
  return (
    <main className="prose relative mx-auto">
      <title>近况 « 故人故事故纸堆</title>
      <meta property="og:title" content="近况 « 故人故事故纸堆" />
      <P
        components={{
          a: HrefToLink,
          // img: ImageCloudflareTransform,
        }}
      />
    </main>
  );
}
