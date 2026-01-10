export default function NotFound() {
  return (
    <main className="prose prose-a:whitespace-nowrap relative mx-auto">
      <title>404 « 故人故事故纸堆</title>
      <meta property="og:title" content="404 « 故人故事故纸堆" />
      <h1>404 - 页面未找到</h1>
      <p>许多文章计划写却迟迟未完成，敬请谅解。</p>
    </main>
  );
}

export const getConfig = () => {
  return {
    render: "static",
    // render: "dynamic",
  } as const;
};
