import P from "../docs/homepage.md";

export default function HomePage() {
  return (
    <main className="relative mx-auto prose prose-a:whitespace-nowrap">
      <title>~ « 故人故事故纸堆</title>
      <meta property="og:title" content="~ « 故人故事故纸堆" />
      <P key="homepage" />
      <strong className="text-cat-subtext1">
        ‼ 如你所见，站点尚未完工，正文尤其有待补档。请耐心等待，谢谢！q(≧▽≦q)
      </strong>
    </main>
  );
}

export const getConfig = () => {
  return {
    render: "static",
    // render: "dynamic",
  } as const;
};
