export default function NotFound() {
  return (
    <main className="relative mx-auto prose prose-a:whitespace-nowrap">
      <title>404 « 故人故事故纸堆</title>
      <meta property="og:title" content="404 « 故人故事故纸堆" />
      <h1>404 - 页面未找到</h1>
      <p>许多文章计划写却迟迟未完成，敬请谅解。</p>
      <p>
        你在找短篇的日记吗？那是本站访问量最大的页面之一，但我不想留着它了。多在本站里找找别的好玩的吧。
      </p>
    </main>
  );
}

export const getConfig = () => {
  return {
    render: "static",
    // render: "dynamic",
  } as const;
};
