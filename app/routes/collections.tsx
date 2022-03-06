// import { Link } from "remix";
// import posts from "../data.json" assert { type: "json" };

import type { MetaFunction } from "remix";

export const meta: MetaFunction = () => {
  return {
    title: "专栏 « Hashland",
    "og:title": "专栏 « Hashland",
    "og:description": "Hash 博学而深思，于是开办若干专栏，分享研究成果。",
    description: "Hash 博学而深思，于是开办若干专栏，分享研究成果。",
  };
};

export default function Collections() {
  return (
    <article className="prose">
      <h1>专栏</h1>
      <p>施工中</p>
    </article>
  );
}
