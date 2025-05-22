import { HrefToLink } from "../../utils/components.tsx";
import P from "./homepage.md";

export default function Index() {
  return (
    <main className="prose prose-a:whitespace-nowrap relative mx-auto">
      <title>~ « 故人故事故纸堆</title>
      <P
        components={{
          a: HrefToLink,
        }}
      />
      <strong className="text-cat-subtext1">
        ‼ 如你所见，站点尚未完工，正文尤其有待补档。请耐心等待，谢谢！q(≧▽≦q)
      </strong>
    </main>

    // <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
    //   <h1>Welcome to Remix</h1>
    //   <ul>
    //     <li>
    //       <a
    //         target="_blank"
    //         href="https://remix.run/tutorials/blog"
    //         rel="noreferrer"
    //       >
    //         15m Quickstart Blog Tutorial
    //       </a>
    //     </li>
    //     <li>
    //       <a
    //         target="_blank"
    //         href="https://remix.run/tutorials/jokes"
    //         rel="noreferrer"
    //       >
    //         Deep Dive Jokes App Tutorial
    //       </a>
    //     </li>
    //     <li>
    //       <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
    //         Remix Docs
    //       </a>
    //     </li>
    //     <li>
    //       <Link to="/post/事/2022-04-01_擦肩上纽.md">About This App</Link>
    //     </li>
    //     <li>
    //       <Link to="/narrative">About This App</Link>
    //     </li>
    //   </ul>
    // </div>
  );
}
