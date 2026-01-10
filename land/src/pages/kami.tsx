import P from "../components/kami.md";

export default function Now() {
  return (
    <main className="prose relative mx-auto">
      <title>故纸堆 « 故人故事故纸堆</title>
      <meta property="og:title" content="故纸堆 « 故人故事故纸堆" />
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
