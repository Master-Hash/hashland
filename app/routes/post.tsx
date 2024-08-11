import { Outlet } from "react-router";

export default function PostWrapper() {
  return (
    <main className="prose mx-6 dark:prose-invert sm:mx-auto">
      {/* <main className="heti mx-auto"> */}
      <Outlet />
    </main>
  );
}
