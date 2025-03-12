import { Outlet } from "react-router";

export default function PostWrapper() {
  return (
    <main className="prose mx-auto">
      {/* <main className="heti mx-auto"> */}
      <Outlet />
    </main>
  );
}

// export const ErrorBoundary = () => {
//   return (
//     <>
//       <title>Forbidden</title>
//       <main className="prose prose-a:break-words relative mx-auto">
//         <h1>Forbidden</h1>
//         <p>
//           大部分条目当前还未公开。如果希望预览，可以刷新页面，然后私下戳我获取6位验证码！
//         </p>
//         <p>或者可能我压根还没起笔，这样请务必来催稿！</p>
//       </main>
//     </>
//   );
// };
