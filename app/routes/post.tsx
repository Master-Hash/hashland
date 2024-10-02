import { Outlet } from "react-router";

export default function PostWrapper() {
  return (
    <main className="prose mx-auto">
      {/* <main className="heti mx-auto"> */}
      <Outlet />
    </main>
  );
}

export const ErrorBoundary = () => {
  return (
    <>
      <title>Forbidden</title>
      <main className="prose relative mx-auto prose-a:break-words">
        <h1>Forbidden</h1>
        <p>
          大部分条目当前还未公开。如果希望预览，可以刷新页面，然后私下戳我获取6位验证码！
        </p>
      </main>
    </>
  );
};
