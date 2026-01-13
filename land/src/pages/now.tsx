import P from "../../post/now.md";

export default function Now() {
  return (
    <main className="relative mx-auto prose">
      <title>近况 « 故人故事故纸堆</title>
      <meta property="og:title" content="近况 « 故人故事故纸堆" />
      <P />
    </main>
  );
}

export const getConfig = () => {
  return {
    render: "static",
    // render: "dynamic",
  } as const;
};
