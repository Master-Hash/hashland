import type { FC } from "react";
import { renderToReadableStream } from "react-dom/server";
import type { LoaderFunction } from "react-router";

class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  mid(b: Point): Point {
    return new Point((this.x + b.x) / 2, (this.y + b.y) / 2);
  }
}

const O = new Point(8, 8),
  A = new Point(
    8 + 8 * Math.cos((15 * Math.PI) / 180),
    8 - 8 * Math.sin((15 * Math.PI) / 180),
  ),
  B = new Point(
    8 + 8 * Math.cos((135 * Math.PI) / 180),
    8 - 8 * Math.sin((135 * Math.PI) / 180),
  ),
  C = new Point(
    8 + 8 * Math.cos((255 * Math.PI) / 180),
    8 - 8 * Math.sin((255 * Math.PI) / 180),
  ),
  D = O.mid(A),
  E = O.mid(B),
  F = O.mid(C);

const Polygon: FC<{ points: Point[] }> = ({ points }) => (
  <polygon
    className="l"
    points={points.map((p) => `${p.x} ${p.y}`).join(", ")}
  />
);

const Line: FC<{ p1: Point; p2: Point }> = ({ p1, p2 }) => (
  <line className="l" x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />
);

function Cube() {
  return (
    <svg version="2.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <defs>
        <style>
          {`.l {
  fill: none;
  stroke: black;
  stroke-width: .36;
}

@media (prefers-color-scheme: dark) {
  .l {
    stroke: white;
  }
}`}
        </style>
      </defs>
      <g transform="translate(-1 -1)">
        <Polygon points={[A, E, C, D, B, F]} />
        <Line p1={O} p2={A} />
        <Line p1={O} p2={B} />
        <Line p1={O} p2={C} />
      </g>
    </svg>
  );
}

export const loader = (async ({ request }) => {
  if (request.headers.get("Accept")?.includes("image/svg+xml")) {
    return new Response(
      await renderToReadableStream(<Cube />, {
        signal: request.signal,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
        },
      },
    );
  } else {
    return Response.redirect(
      new URL("_favicon.ico", import.meta.env.VITE_SITEURL),
      301,
    );
  }
}) satisfies LoaderFunction;
