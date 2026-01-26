import P from "../components/colophon.md";

export default function Now() {
  return (
    <main className="relative mx-auto prose">
      <title>封底内页 « 故人故事故纸堆</title>
      <meta property="og:title" content="封底内页 « 故人故事故纸堆" />
      <P />
    </main>
  );
}

export const getConfig = () => {
  return {
    render: "static",
  } as const;
};
