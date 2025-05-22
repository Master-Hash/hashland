import { Bevy, Err } from "./b.tsx";

export default function ConnectionsRs() {
  return (
    <main className="prose prose-a:whitespace-nowrap relative mx-auto">
      <title>示例：逻辑分辨率 « 故人故事故纸堆</title>
      <Bevy />
      <p>
        不定时重新编译。我目前不大可能用 bevy
        重写完整应用，但我会保留此示例以测试读者设备的分辨率，我的
        CI，以及未来的平台和应用特性。
        <a href="https://bevyengine.org/examples/window/window-resizing/">
          源代码
        </a>
        。
      </p>
    </main>
  );
}

export const ErrorBoundary = () => {
  <Err />;
};
