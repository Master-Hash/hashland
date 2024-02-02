import type {
  // LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { useEffect, useRef } from "react";
import type { Config, Spec } from "vega";
import { View, parse } from "vega";
import { dark } from "vega-themes";
// import { json } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Vega Test" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const values = {
  nodes: [
    { name: "锦心", group: "人", index: 0 },
    { name: "介入", group: "事", index: 1 },
    { name: "ll", group: "物", index: 2 },
    { name: "MTF", group: "情思", index: 3 },
  ],
  links: [
    { source: 0, target: 2, value: 1 },
    { source: 0, target: 3, value: 1 },
    { source: 1, target: 3, value: 3 },
    { source: 2, target: 3, value: 1 },
    //   { source: 1, target: 0, value: 1 },
    //   { source: 2, target: 0, value: 8 },
    //   { source: 3, target: 0, value: 10 },
    //   { source: 3, target: 2, value: 6 },
    //   { source: 4, target: 0, value: 1 },
    //   { source: 5, target: 0, value: 1 },
    //   { source: 6, target: 0, value: 1 },
    //   { source: 7, target: 0, value: 1 },
    //   { source: 8, target: 0, value: 2 },
    //   { source: 9, target: 0, value: 1 },
    //   { source: 11, target: 10, value: 1 },
    //   { source: 11, target: 3, value: 3 },
    //   { source: 11, target: 2, value: 3 },
    //   { source: 11, target: 0, value: 5 },
    //   { source: 12, target: 11, value: 1 },
    //   { source: 13, target: 11, value: 1 },
    //   { source: 14, target: 11, value: 1 },
    //   { source: 15, target: 11, value: 1 },
    //   { source: 17, target: 16, value: 4 },
    //   { source: 18, target: 16, value: 4 },
    //   { source: 18, target: 17, value: 4 },
    //   { source: 19, target: 16, value: 4 },
    //   { source: 19, target: 17, value: 4 },
    //   { source: 19, target: 18, value: 4 },
    //   { source: 20, target: 16, value: 3 },
    //   { source: 20, target: 17, value: 3 },
    //   { source: 20, target: 18, value: 3 },
    //   { source: 20, target: 19, value: 4 },
    //   { source: 21, target: 16, value: 3 },
    //   { source: 21, target: 17, value: 3 },
    //   { source: 21, target: 18, value: 3 },
    //   { source: 21, target: 19, value: 3 },
    //   { source: 21, target: 20, value: 5 },
    //   { source: 22, target: 16, value: 3 },
    //   { source: 22, target: 17, value: 3 },
    //   { source: 22, target: 18, value: 3 },
    //   { source: 22, target: 19, value: 3 },
    //   { source: 22, target: 20, value: 4 },
    //   { source: 22, target: 21, value: 4 },
    //   { source: 23, target: 16, value: 3 },
    //   { source: 23, target: 17, value: 3 },
    //   { source: 23, target: 18, value: 3 },
    //   { source: 23, target: 19, value: 3 },
    //   { source: 23, target: 20, value: 4 },
    //   { source: 23, target: 21, value: 4 },
    //   { source: 23, target: 22, value: 4 },
    //   { source: 23, target: 12, value: 2 },
    //   { source: 23, target: 11, value: 9 },
    //   { source: 24, target: 23, value: 2 },
    //   { source: 24, target: 11, value: 7 },
    //   { source: 25, target: 24, value: 13 },
    //   { source: 25, target: 23, value: 1 },
    //   { source: 25, target: 11, value: 12 },
    //   { source: 26, target: 24, value: 4 },
    //   { source: 26, target: 11, value: 31 },
    //   { source: 26, target: 16, value: 1 },
    //   { source: 26, target: 25, value: 1 },
    //   { source: 27, target: 11, value: 17 },
    //   { source: 27, target: 23, value: 5 },
    //   { source: 27, target: 25, value: 5 },
    //   { source: 27, target: 24, value: 1 },
    //   { source: 27, target: 26, value: 1 },
    //   { source: 28, target: 11, value: 8 },
    //   { source: 28, target: 27, value: 1 },
    //   { source: 29, target: 23, value: 1 },
    //   { source: 29, target: 27, value: 1 },
    //   { source: 29, target: 11, value: 2 },
    //   { source: 30, target: 23, value: 1 },
    //   { source: 31, target: 30, value: 2 },
    //   { source: 31, target: 11, value: 3 },
    //   { source: 31, target: 23, value: 2 },
    //   { source: 31, target: 27, value: 1 },
    //   { source: 32, target: 11, value: 1 },
    //   { source: 33, target: 11, value: 2 },
    //   { source: 33, target: 27, value: 1 },
    //   { source: 34, target: 11, value: 3 },
    //   { source: 34, target: 29, value: 2 },
    //   { source: 35, target: 11, value: 3 },
    //   { source: 35, target: 34, value: 3 },
    //   { source: 35, target: 29, value: 2 },
    //   { source: 36, target: 34, value: 2 },
    //   { source: 36, target: 35, value: 2 },
    //   { source: 36, target: 11, value: 2 },
    //   { source: 36, target: 29, value: 1 },
    //   { source: 37, target: 34, value: 2 },
    //   { source: 37, target: 35, value: 2 },
    //   { source: 37, target: 36, value: 2 },
    //   { source: 37, target: 11, value: 2 },
    //   { source: 37, target: 29, value: 1 },
    //   { source: 38, target: 34, value: 2 },
    //   { source: 38, target: 35, value: 2 },
    //   { source: 38, target: 36, value: 2 },
    //   { source: 38, target: 37, value: 2 },
    //   { source: 38, target: 11, value: 2 },
    //   { source: 38, target: 29, value: 1 },
    //   { source: 39, target: 25, value: 1 },
    //   { source: 40, target: 25, value: 1 },
    //   { source: 41, target: 24, value: 2 },
    //   { source: 41, target: 25, value: 3 },
    //   { source: 42, target: 41, value: 2 },
    //   { source: 42, target: 25, value: 2 },
    //   { source: 42, target: 24, value: 1 },
    //   { source: 43, target: 11, value: 3 },
    //   { source: 43, target: 26, value: 1 },
    //   { source: 43, target: 27, value: 1 },
    //   { source: 44, target: 28, value: 3 },
    //   { source: 44, target: 11, value: 1 },
    //   { source: 45, target: 28, value: 2 },
    //   { source: 47, target: 46, value: 1 },
    //   { source: 48, target: 47, value: 2 },
    //   { source: 48, target: 25, value: 1 },
    //   { source: 48, target: 27, value: 1 },
    //   { source: 48, target: 11, value: 1 },
    //   { source: 49, target: 26, value: 3 },
    //   { source: 49, target: 11, value: 2 },
    //   { source: 50, target: 49, value: 1 },
    //   { source: 50, target: 24, value: 1 },
    //   { source: 51, target: 49, value: 9 },
    //   { source: 51, target: 26, value: 2 },
    //   { source: 51, target: 11, value: 2 },
    //   { source: 52, target: 51, value: 1 },
    //   { source: 52, target: 39, value: 1 },
    //   { source: 53, target: 51, value: 1 },
    //   { source: 54, target: 51, value: 2 },
    //   { source: 54, target: 49, value: 1 },
    //   { source: 54, target: 26, value: 1 },
    //   { source: 55, target: 51, value: 6 },
    //   { source: 55, target: 49, value: 12 },
    //   { source: 55, target: 39, value: 1 },
    //   { source: 55, target: 54, value: 1 },
    //   { source: 55, target: 26, value: 21 },
    //   { source: 55, target: 11, value: 19 },
    //   { source: 55, target: 16, value: 1 },
    //   { source: 55, target: 25, value: 2 },
    //   { source: 55, target: 41, value: 5 },
    //   { source: 55, target: 48, value: 4 },
    //   { source: 56, target: 49, value: 1 },
    //   { source: 56, target: 55, value: 1 },
    //   { source: 57, target: 55, value: 1 },
    //   { source: 57, target: 41, value: 1 },
    //   { source: 57, target: 48, value: 1 },
    //   { source: 58, target: 55, value: 7 },
    //   { source: 58, target: 48, value: 7 },
    //   { source: 58, target: 27, value: 6 },
    //   { source: 58, target: 57, value: 1 },
    //   { source: 58, target: 11, value: 4 },
    //   { source: 59, target: 58, value: 15 },
    //   { source: 59, target: 55, value: 5 },
    //   { source: 59, target: 48, value: 6 },
    //   { source: 59, target: 57, value: 2 },
    //   { source: 60, target: 48, value: 1 },
    //   { source: 60, target: 58, value: 4 },
    //   { source: 60, target: 59, value: 2 },
    //   { source: 61, target: 48, value: 2 },
    //   { source: 61, target: 58, value: 6 },
    //   { source: 61, target: 60, value: 2 },
    //   { source: 61, target: 59, value: 5 },
    //   { source: 61, target: 57, value: 1 },
    //   { source: 61, target: 55, value: 1 },
    //   { source: 62, target: 55, value: 9 },
    //   { source: 62, target: 58, value: 17 },
    //   { source: 62, target: 59, value: 13 },
    //   { source: 62, target: 48, value: 7 },
    //   { source: 62, target: 57, value: 2 },
    //   { source: 62, target: 41, value: 1 },
    //   { source: 62, target: 61, value: 6 },
    //   { source: 62, target: 60, value: 3 },
    //   { source: 63, target: 59, value: 5 },
    //   { source: 63, target: 48, value: 5 },
    //   { source: 63, target: 62, value: 6 },
    //   { source: 63, target: 57, value: 2 },
    //   { source: 63, target: 58, value: 4 },
    //   { source: 63, target: 61, value: 3 },
    //   { source: 63, target: 60, value: 2 },
    //   { source: 63, target: 55, value: 1 },
    //   { source: 64, target: 55, value: 5 },
    //   { source: 64, target: 62, value: 12 },
    //   { source: 64, target: 48, value: 5 },
    //   { source: 64, target: 63, value: 4 },
    //   { source: 64, target: 58, value: 10 },
    //   { source: 64, target: 61, value: 6 },
    //   { source: 64, target: 60, value: 2 },
    //   { source: 64, target: 59, value: 9 },
    //   { source: 64, target: 57, value: 1 },
    //   { source: 64, target: 11, value: 1 },
    //   { source: 65, target: 63, value: 5 },
    //   { source: 65, target: 64, value: 7 },
    //   { source: 65, target: 48, value: 3 },
    //   { source: 65, target: 62, value: 5 },
    //   { source: 65, target: 58, value: 5 },
    //   { source: 65, target: 61, value: 5 },
    //   { source: 65, target: 60, value: 2 },
    //   { source: 65, target: 59, value: 5 },
    //   { source: 65, target: 57, value: 1 },
    //   { source: 65, target: 55, value: 2 },
    //   { source: 66, target: 64, value: 3 },
    //   { source: 66, target: 58, value: 3 },
    //   { source: 66, target: 59, value: 1 },
    //   { source: 66, target: 62, value: 2 },
    //   { source: 66, target: 65, value: 2 },
    //   { source: 66, target: 48, value: 1 },
    //   { source: 66, target: 63, value: 1 },
    //   { source: 66, target: 61, value: 1 },
    //   { source: 66, target: 60, value: 1 },
    //   { source: 67, target: 57, value: 3 },
    //   { source: 68, target: 25, value: 5 },
    //   { source: 68, target: 11, value: 1 },
    //   { source: 68, target: 24, value: 1 },
    //   { source: 68, target: 27, value: 1 },
    //   { source: 68, target: 48, value: 1 },
    //   { source: 68, target: 41, value: 1 },
    //   { source: 69, target: 25, value: 6 },
    //   { source: 69, target: 68, value: 6 },
    //   { source: 69, target: 11, value: 1 },
    //   { source: 69, target: 24, value: 1 },
    //   { source: 69, target: 27, value: 2 },
    //   { source: 69, target: 48, value: 1 },
    //   { source: 69, target: 41, value: 1 },
    //   { source: 70, target: 25, value: 4 },
    //   { source: 70, target: 69, value: 4 },
    //   { source: 70, target: 68, value: 4 },
    //   { source: 70, target: 11, value: 1 },
    //   { source: 70, target: 24, value: 1 },
    //   { source: 70, target: 27, value: 1 },
    //   { source: 70, target: 41, value: 1 },
    //   { source: 70, target: 58, value: 1 },
    //   { source: 71, target: 27, value: 1 },
    //   { source: 71, target: 69, value: 2 },
    //   { source: 71, target: 68, value: 2 },
    //   { source: 71, target: 70, value: 2 },
    //   { source: 71, target: 11, value: 1 },
    //   { source: 71, target: 48, value: 1 },
    //   { source: 71, target: 41, value: 1 },
    //   { source: 71, target: 25, value: 1 },
    //   { source: 72, target: 26, value: 2 },
    //   { source: 72, target: 27, value: 1 },
    //   { source: 72, target: 11, value: 1 },
    //   { source: 73, target: 48, value: 2 },
    //   { source: 74, target: 48, value: 2 },
    //   { source: 74, target: 73, value: 3 },
    //   { source: 75, target: 69, value: 3 },
    //   { source: 75, target: 68, value: 3 },
    //   { source: 75, target: 25, value: 3 },
    //   { source: 75, target: 48, value: 1 },
    //   { source: 75, target: 41, value: 1 },
    //   { source: 75, target: 70, value: 1 },
    //   { source: 75, target: 71, value: 1 },
    //   { source: 76, target: 64, value: 1 },
    //   { source: 76, target: 65, value: 1 },
    //   { source: 76, target: 66, value: 1 },
    //   { source: 76, target: 63, value: 1 },
    //   { source: 76, target: 62, value: 1 },
    //   { source: 76, target: 48, value: 1 },
    //   { source: 76, target: 58, value: 1 },
  ],
};

const spec = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  description:
    "A node-link diagram with force-directed layout, depicting character co-occurrence in the novel Les Misérables.",
  width: 700,
  height: 500,
  padding: 0,
  autosize: "none",
  signals: [
    { name: "cx", update: "width / 2" },
    { name: "cy", update: "height / 2" },
    {
      name: "nodeCharge",
      value: -30,
      bind: { input: "range", min: -100, max: 10, step: 1 },
    },
    {
      name: "linkDistance",
      value: 30,
      bind: { input: "range", min: 5, max: 100, step: 1 },
    },
    { name: "static", value: false },
    {
      description: "State variable for active node fix status.",
      name: "fix",
      value: false,
      on: [
        {
          events: "symbol:pointerout[!event.buttons], window:pointerup",
          update: "false",
        },
        { events: "symbol:pointerover", update: "fix || true" },
        {
          events:
            "[symbol:pointerdown, window:pointerup] > window:pointermove!",
          update: "xy()",
          force: true,
        },
      ],
    },
    {
      description: "Graph node most recently interacted with.",
      name: "node",
      value: null,
      on: [
        {
          events: "symbol:pointerover",
          update: "fix === true ? item() : node",
        },
      ],
    },
    {
      description: "Flag to restart Force simulation upon data changes.",
      name: "restart",
      value: false,
      on: [{ events: { signal: "fix" }, update: "fix && fix.length" }],
    },
  ],
  data: [
    {
      name: "node-data",
      values: {
        nodes: [
          {
            name: "锦心",
            group: "人",
            value: 2,
            link: "https://lhcfl.github.io/",
          },
          { name: "介入", group: "事", value: 1 },
          {
            name: "ll",
            group: "物",
            value: 2,
            link: "https://forum.limonnur.party/",
          },
          { name: "MTF", group: "情思", value: 3 },
        ],
        links: [
          { source: 0, target: 2 },
          { source: 0, target: 3 },
          { source: 1, target: 3 },
          { source: 2, target: 3 },
        ],
      },
      format: { type: "json", property: "nodes" },
    },
    {
      name: "link-data",
      values: {
        nodes: [
          { name: "锦心", group: "人", value: 2 },
          { name: "介入", group: "事", value: 1 },
          { name: "ll", group: "物", value: 2 },
          { name: "MTF", group: "情思", value: 3 },
        ],
        links: [
          { source: 0, target: 2 },
          { source: 0, target: 3 },
          { source: 1, target: 3 },
          { source: 2, target: 3 },
        ],
      },
      format: { type: "json", property: "links" },
    },
  ],
  scales: [
    {
      name: "color",
      type: "ordinal",
      domain: { data: "node-data", field: "group" },
      range: { scheme: "accent" },
    },
    {
      name: "size",
      type: "linear",
      domain: { data: "node-data", field: "value" },
      range: [36, 256],
    },
  ],
  marks: [
    {
      name: "nodes",
      type: "symbol",
      zindex: 1,
      from: { data: "node-data" },
      on: [
        {
          trigger: "fix",
          modify: "node",
          values:
            "fix === true ? {fx: node.x, fy: node.y} : {fx: fix[0], fy: fix[1]}",
        },
        { trigger: "!fix", modify: "node", values: "{fx: null, fy: null}" },
      ],
      encode: {
        enter: {
          fill: { scale: "color", field: "group" },
          size: { scale: "size", field: "value" },
          stroke: { value: "white" },
        },
        update: { cursor: { value: "pointer" } },
      },
      transform: [
        {
          type: "force",
          iterations: 300,
          restart: { signal: "restart" },
          static: { signal: "static" },
          signal: "force",
          forces: [
            { force: "center", x: { signal: "cx" }, y: { signal: "cy" } },
            { force: "collide", radius: { expr: "sqrt(datum.value)" } },
            { force: "nbody", strength: { signal: "nodeCharge" } },
            {
              force: "link",
              links: "link-data",
              distance: { signal: "linkDistance" },
            },
          ],
        },
      ],
    },
    {
      type: "path",
      from: { data: "link-data" },
      interactive: false,
      encode: {
        update: { stroke: { value: "#ccc" }, strokeWidth: { value: 0.5 } },
      },
      transform: [
        {
          type: "linkpath",
          require: { signal: "force" },
          shape: "line",
          sourceX: "datum.source.x",
          sourceY: "datum.source.y",
          targetX: "datum.target.x",
          targetY: "datum.target.y",
        },
      ],
    },
    {
      type: "text",
      from: { data: "nodes" },
      encode: {
        enter: {
          fill: { value: "#eee" },
          align: { value: "center" },
          dy: { field: "datum.value", exponent: 0.2, mult: 16 },
        },
        update: {
          text: { field: "datum.name" },
          x: { field: "x" },
          y: { field: "y" },
          href: { field: "datum.link" },
        },
      },
      transform: [],
    },
  ],
} as Spec;

// export const loader = (async () => {
//   const _view = new View(parse(spec)).renderer("hybrid").hover();
//   return json(
//     {
//       svg: await _view.toSVG(),
//     },
//     {
//       headers: {
//         "Cache-Control": "public, maxage=6000",
//       },
//     },
//   );
// }) satisfies LoaderFunction;

/**
 * ~~状态尽可能留在 Vega 内部。打算只造一个主页，不需要从 Router 里提取数据……大概？~~
 * 还是要提取的。
 * @todo RSC 出来之后，也许会拆分成两个组件
 * @todo loader 缓存不太对，也等 RSC
 * @todo toSVG() 似乎不支持部分图表
 */
export default function Vega() {
  // const { svg } = useLoaderData<typeof loader>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runtime =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? parse(spec, { ...dark, background: "#24273a" } as Config)
        : parse(spec, { background: "#eff1f5" });
    const view =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? new View(runtime).renderer("hybrid").hover()
        : new View(runtime).renderer("hybrid").hover();
    view.initialize(ref.current ?? undefined).runAsync();
    return () => {
      view.finalize();
    };
  }, []);

  return (
    <main className="mx-auto" ref={ref}>
      {/*<noscript dangerouslySetInnerHTML={{ __html: svg }}></noscript>*/}
    </main>
  );
}
