import cytoscape from "cytoscape";
import { useEffect, useRef } from "react";
import { Link, type LoaderFunctionArgs } from "react-router";
import { clientOnly$ } from "vite-env-only/macros";
import { Count8Client } from "./client.tsx";
// import data from "./data.json" with { type: "json" };

const d = import.meta.glob("./*.json", { import: "default" });

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const n = url.searchParams.get("c") ?? "8";
  const data = await d[`./data${n}.json`]();
  return { data };
}

export default function Count8({ loaderData }) {
  const data = loaderData.data;
  const ref = useRef<HTMLDivElement>(null);
  clientOnly$(
    useEffect(() => {
      const cy = cytoscape({
        container: ref.current,
        elements: data,
        pixelRatio: "auto",
        webgl: true,
        layout: {
          name: "breadthfirst",
          directed: true,
          padding: 20,
          animate: true,
        },
        // layout: {
        //   name: "concentric",
        // },
        // layout: {
        //   name: "cose",
        // },
        style: [
          {
            selector: "node.white",
            style: {
              "background-color": "#fff",
            },
          },
          {
            selector: "node.black",
            style: {
              "background-color": "#000",
            },
          },
          {
            selector: "node.win",
            style: {
              "border-color": "green",
              "border-width": 2,
            },
          },
          {
            selector: "node.lose",
            style: {
              "border-color": "red",
              "border-width": 2,
            },
          },
          {
            selector: "node.winwin",
            style: {
              "border-color": "chartreuse",
              "border-width": 2,
            },
          },
          {
            selector: "node.loselose",
            style: {
              "border-color": "violet",
              "border-width": 2,
            },
          },
          {
            selector: "node",
            style: {
              label: "data(label)",
              "text-wrap": "wrap",
              "text-valign": "bottom",
              "text-halign": "center",
              color: "beige",
              "font-size": 20,
              width: 40,
              height: 40,
            },
          },
          {
            selector: "node.terminal",
            style: {
              shape: "star",
            },
          },
          {
            selector: "node.root",
            style: {
              shape: "rectangle",
            },
          },

          {
            selector: "node.faded",
            style: {
              "text-opacity": 0.2,
              "background-opacity": 0.1,
              "border-opacity": 0.1,
            },
          },
          {
            selector: "edge",
            style: {
              width: 2,
              // "arrow-scale": 20,
              "line-color": "#ccc",
              "curve-style": "bezier",
              "target-arrow-shape": "vee",
            },
          },
          {
            selector: "edge.faded",
            style: {
              opacity: 0.05,
              "target-arrow-shape": "none",
            },
          },
        ],
      });
      const root = cy.getElementById("node0");
      root.addClass("root");
      // const reachable = root.outgoers(); // 根节点 + 可到达的后代

      cy.nodes().not("#node0").addClass("faded");
      cy.edges().addClass("faded");
      root.removeClass("faded");

      cy.on("tap", "node", (evt) => {
        const node = evt.target;
        const outgoers = node.outgoers().union(node);

        outgoers.removeClass("faded"); // 显示邻接节点和边
      });

      const components = cy.elements().components();
      console.log("子图数量:", components.length);
      components.forEach((component, i) => {
        console.log(`子图 ${i} 包含 ${component.nodes().length} 个元素`);
      });

      return () => {
        cy.destroy();
      };
    }, []),
  );
  return (
    <main className="prose mx-auto">
      <title>凑8图论演示 « 故人故事故纸堆</title>
      <h1>凑8图论演示</h1>
      <Count8Client data={data} />
      <p>
        凑8游戏是 <Link to="/人/junyu33.md">Max</Link>{" "}
        初一军训时向我介绍的最爱的游戏，其规则为：开局时，两个人两只手都是1，双方轮流，每轮玩家可以将自己手上的一个数字的值变为该数字和对方手上某个数字的和（只准加，不准加自己），如果超过7，一律变为1，如果为8，则撤手，两只手都撤下为赢。
      </p>
      <p>
        上图为凑8游戏的博弈树。这里正方形表示起始状态，圆表示中间状态，星表示终局状态。边框亮绿表示轮次方大赢，浅绿表示小赢，红色表示小输，粉色表示大输。游戏规则和分析方法参见我和{" "}
        <Link to="/人/junyu33.md">Max</Link> 合作的
        <a
          href="https://blog.junyu33.me/2025/05/23/eights"
          target="_blank"
          rel="noreferrer"
        >
          文章
        </a>
        。
      </p>
      <p>
        如果上图太小，你可能更想看
        <Link to="/count8?c=3">凑3游戏</Link>
        的情况。
      </p>
    </main>
  );
}
