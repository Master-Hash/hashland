"use client";

import cytoscape from "cytoscape?client";
// import { isMobile } from "pixi.js";
import { useEffect, useRef } from "react";
// import { useSearchParams } from "react-router";
// import { clientOnly$ } from "vite-env-only/macros";

export function Count8Client({
  data,
}: {
  data: cytoscape.ElementDefinition[];
}) {
  "use memo";
  // const [searchParams] = useSearchParams();
  const ref = useRef<HTMLDivElement>(null);
  if (!import.meta.env.SSR) {
    useEffect(() => {
      const cy = cytoscape({
        container: ref.current,
        elements: data,
        pixelRatio: "auto",
        // 这玩意整坏了移动端交互
        // webgl: !isMobile.any,
        webgl: false,
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
        console.log(evt);
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
    }, [data]);
  }
  return <section className="h-96" ref={ref}></section>;
}
