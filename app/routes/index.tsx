import type { MetaFunction } from "remix";
import { MailIcon } from "@heroicons/react/outline";

export const meta: MetaFunction = () => {
  return {
    "og:site_name": "Hashland",
    title: "Hashland",
    "og:title": "Hashland",
    "og:description": "（）",
    description: "（）",
  };
};

export default function Index() {
  return (
    <>
      <article className="mx-auto prose dark:prose-invert">
        <h1>你好。</h1>
      </article>
      <address className="flex space-x-2 my-4 items-center not-italic">
        <MailIcon className="h-4 w-4" />
        <a href="mailto:A137294381b@163.com">A137294381b@163.com</a>
      </address>
    </>
  );
}
