import type { Container, FederatedPointerEvent } from "pixi.js";
import { Point } from "pixi.js";
let zodiacAngularVelocity = 0;

export function addZodiac(container: Container) {
  let dragTarget = null as Container | null;
  const dragPreviousPoint = new Point();
  container.eventMode = "static";
  container.hitArea = {
    contains: (x, y) => {
      if (dragTarget) return true;
      const d = Math.hypot(x, y);
      const r = 360;
      // console.log(d, r, x, y);
      return d < r + 20 && d > r - 15;
    },
  };
  container.cursor = "pointer";
  container.on("pointerdown", (e) => {
    dragTarget = container;
    const { x, y } = e.global;
    // console.log(x, y);
    dragPreviousPoint.set(x, y);
    zodiacAngularVelocity = 0;
  });
  container.on("pointermove", function (e) {
    const previousRotate = Math.atan2(
      dragPreviousPoint.y - container.y,
      dragPreviousPoint.x - container.x,
    );
    const { x, y } = e.global;
    const nowRotate = Math.atan2(y - container.y, x - container.x);
    // console.log(
    //   (previousRotate / Math.PI) * 180,
    //   (nowRotate / Math.PI) * 180,
    // );
    if (dragTarget) {
      zodiacAngularVelocity = nowRotate - previousRotate;
      container.rotation += zodiacAngularVelocity;
      // chronicleSprites.forEach((c) => {
      //   c.rotation = -container.rotation;
      // });
      dragPreviousPoint.set(x, y);
      return;
    }
  });
  function onDragEnd(e: FederatedPointerEvent) {
    dragTarget = null;
    dragPreviousPoint.set(0, 0);
  }
  container.on("pointerup", onDragEnd);
  container.on("pointerupoutside", onDragEnd);
  return { dragTarget, zodiacAngularVelocity };
}
