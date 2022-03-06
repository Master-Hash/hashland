import { MailIcon } from "@heroicons/react/outline";

export default function Index() {
  return (
    <article className="mx-auto prose prose-blockquote:not-italic">
      <h1>你好。</h1>
      <p className="flex space-x-2 items-center">
        <MailIcon className="h-4 w-4" />
        <a href="mailto:A137294381b@163.com">A137294381b@163.com</a>
      </p>

    </article>
  );
}
