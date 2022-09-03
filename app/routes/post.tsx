import { Outlet } from "@remix-run/react";

/**
 * @todo Giscus
 */
export default function Post() {
  return <main className="flex-grow dark:text-white mx-auto">
    <article className="prose dark:prose-invert">
      <Outlet />
    </article>
  </main>;
}