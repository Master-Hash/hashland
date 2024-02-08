import { Outlet } from "@remix-run/react";

export default function PostWrapper() {
  return (
    <main className="prose mx-auto dark:prose-invert">
      <Outlet />;
    </main>
  );
}
