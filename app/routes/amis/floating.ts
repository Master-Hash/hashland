import type { Sprite } from "pixi.js";
import { Container, Graphics, Text } from "pixi.js";
import type { RefObject } from "react";
import type { useNavigate } from "react-router";

const mockData = {
  Ayu: "https://ayu.land/",
  Spheniscidae: "https://blog.sphenhe.me/",
} as Record<string, string>;

export const floatBubbles = new Map() as Map<
  string,
  {
    data: Graphics;
    container: Container;
    events: Sprite[];
    xVelocity: number;
    yVelocity: number;
    dragged: boolean;
  }
>;

export function addBubble(
  name: string,
  event: Sprite,
  isDark: RefObject<boolean>,
  navigate: ReturnType<typeof useNavigate>,
) {
  if (!floatBubbles.has(name)) {
    const a = Math.random() * Math.PI * 2;
    const container = new Container();
    const bubble = new Graphics().circle(0, 0, 7).fill(0xffffff);
    const text = new Text({
      text: name, //🪐
      style: {
        fill: isDark.current ? 0xe5c890 : 0xdf8e1d,
        fontSize: 9,
        fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Noto Emoji"',
        align: "center",
      },
    });
    text.anchor.set(0.5, 0);
    text.y = 6;
    text.visible = false;
    container.eventMode = "static";
    container.on("mouseenter", () => {
      text.visible = true;
      // console.log(container);
      if (mockData[name] !== undefined) {
        container.children[0].visible = true;
      }
    });
    container.on("mouseleave", () => {
      text.visible = false;
      if (mockData[name] !== undefined) {
        container.children[0].visible = false;
      }
    });
    container.on("tap", () => {
      text.visible = true;
      if (mockData[name] !== undefined) {
        container.children[0].visible = true;
      }
      setTimeout(() => {
        text.visible = false;
        if (mockData[name] !== undefined) {
          container.children[0].visible = false;
        }
      }, 800);
    });
    text.eventMode = "static";
    text.cursor = "pointer";
    text.on("pointerdown", () => {
      navigate(`/post/人/${name}.md`);
    });
    if (mockData[name] !== undefined) {
      const siteText = new Text({
        text: "⋆⭒友链⋆⭒",
        style: {
          fill: isDark.current ? 0xbabbf1 : 0x7287fd,
          fontSize: 9,
          fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Noto Emoji"',
          align: "center",
        },
      });
      siteText.anchor.set(0.5, 0);
      siteText.y = 16;
      siteText.visible = false;
      siteText.eventMode = "static";
      siteText.cursor = "pointer";
      siteText.on("pointerdown", () => {
        window.open(mockData[name], "_blank", "noopener,noreferrer")?.focus();
      });
      container.addChild(siteText);
    }

    // text.visible = false;
    // text.eventMode

    container.addChild(bubble);
    container.addChild(text);
    floatBubbles.set(name, {
      data: bubble,
      container,
      events: [event],
      xVelocity: Math.cos(a),
      yVelocity: Math.sin(a),
      dragged: false,
    });
  } else floatBubbles.get(name)!.events.push(event);
}
