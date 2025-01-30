import Color from "colorjs.io";
import type { Application, FederatedPointerEvent, Texture } from "pixi.js";
import { Container, Point, Sprite, Text } from "pixi.js";
import type { useNavigate } from "react-router";
import chronicles from "./chronicle.js";
import { colors } from "./colors.js";
import { addBubble, floatBubbles } from "./floating.js";

const PADDING = 15;

export function pixiApp(
  app: Application,
  isDark: boolean,
  navigate: ReturnType<typeof useNavigate>,
  texture: Record<string, Texture>,
): void {
  // const texture = await loadTexture();
  console.log(texture);

  //#region Zodiac
  const zodiac = Sprite.from(texture["zodiac"]);

  const container = new Container();
  app.stage.addChild(container);
  container.addChild(zodiac);
  zodiac.anchor.set(0.5);
  // MAGIC NUMBER zodiac scale here
  zodiac.scale.set(0.54);
  zodiac.tint = isDark ? 0xa5adce : 0x6c6f85;
  container.x = app.screen.width / 2;
  // MAGIC NUMBER y here
  container.y = app.screen.height / 2 + 365;
  container.rotation =
    ((new Date().valueOf() - new Date("2024-05-01").valueOf()) /
      31556926 /
      500) *
    Math.PI;

  let dragTarget = null as Container | null;
  const dragPreviousPoint = new Point();
  let zodiacAngularVelocity = 0;
  zodiac.eventMode = "static";
  zodiac.hitArea = {
    contains: (x, y) => {
      if (dragTarget) return true;
      const d = Math.hypot(x, y);
      const r = 722;
      // console.log(d, r, x, y);
      return d < r + 40 && d > r - 35;
    },
  };
  zodiac.cursor = "pointer";
  zodiac.on("pointerdown", (e) => {
    dragTarget = container;
    const { x, y } = e.global;
    // console.log(x, y);
    dragPreviousPoint.set(x, y);
    zodiacAngularVelocity = 0;
  });
  zodiac.on("pointermove", function (e) {
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
      // 为了高速旋转的手感，这里有另一种方案
      // zodiacAngularVelocity = Math.max(nowRotate - previousRotate, zodiacAngularVelocity);
      // 但这样会牺牲低速手感，没法精确控制拖动距离
      // 唯一两全其美的办法，就是弹簧了……
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
  zodiac.on("pointerup", onDragEnd);
  zodiac.on("pointerupoutside", onDragEnd);
  //#endregion

  //#region Evnets
  const chronicleSprites = [] as Sprite[];
  floatBubbles.clear();
  chronicles.forEach((c) => {
    const date = new Date(c.date);
    const r =
      container.y * 0.66 +
      (date.valueOf() - new Date("2024-01-01").valueOf()) / 1000000000;
    const secondInTropicYear = 31556926;
    const radian =
      ((date.valueOf() / 1000 - new Date("2024-01-01").valueOf() / 1000) /
        secondInTropicYear) *
      2 *
      Math.PI;
    const color = isDark
      ? new Color(`oklch(69% 0.1 ${4 - radian}rad)`)
      : new Color(`oklch(42% 0.1 ${4 - radian}rad)`);
    const eventContainer = new Container();
    const event = Sprite.from(texture[c.emoji]);
    event.anchor.set(0.5);
    event.scale.set(0.1);
    eventContainer.x = r * Math.cos(-radian);
    eventContainer.y = r * Math.sin(-radian);
    eventContainer.rotation = -radian + Math.PI / 2 + Math.random() - 0.5;
    // event.tint = isDark ? 0x85c1dc : 0x209fb5; // Sapphire
    event.tint = parseInt(
      color.to("srgb").toString({ format: "hex" }).slice(1),
      16,
    );

    // label
    const lable = new Text({
      text: c.title,
      style: {
        align: "center",
        fontSize: 13,
        fill: isDark ? 0x85c1dc : 0x209fb5,
      },
    });
    lable.visible = false;
    lable.anchor.set(0.5);
    lable.y = 18;

    eventContainer.eventMode = "static";
    eventContainer.cursor = "pointer";
    eventContainer.hitArea = {
      contains: (x, y) => {
        return Math.hypot(x, y) < 26;
      },
    };

    eventContainer.on("mouseenter", (e) => {
      lable.visible = true;
    });
    eventContainer.on("mouseleave", (e) => {
      lable.visible = false;
    });
    // eventContainer.on("mousedown", (e) => {
    //   navigate(`/post/事/${c.date}_${c.title}.md`);
    // });
    eventContainer.on("tap", (e) => {
      // navigate(`/post/事/${c.date}_${c.title}.md`);
      lable.visible = true;
      setTimeout(() => {
        lable.visible = false;
      }, 800);
    });
    lable.eventMode = "static";
    lable.cursor = "pointer";
    lable.on("pointerdown", (e) => {
      if (e.ctrlKey) {
        window
          .open(
            `/post/事/${c.date}_${c.title}.md`,
            "_blank",
            "noopener,noreferrer",
          )
          ?.focus();
      } else {
        void navigate(`/post/事/${c.date}_${c.title}.md`);
      }
    });

    eventContainer.addChild(event);
    eventContainer.addChild(lable);
    container.addChild(eventContainer);
    chronicleSprites.push(event);

    for (const person of c.people) {
      addBubble(person, event, isDark, navigate);
    }
  });
  //#endregion
  //#region Bubbles
  {
    let i = 0;
    const dragFloatPreviousPoint = new Point();
    for (const [name, dataObj] of floatBubbles) {
      const x = Math.random() * (app.screen.width - PADDING * 2) + PADDING;
      const y = Math.random() * (app.screen.height - PADDING * 2) + PADDING;
      const { data, container: bubbleContainer } = dataObj;
      // data.x = x;
      // data.y = y;
      bubbleContainer.x = x;
      bubbleContainer.y = y;
      data.cursor = "pointer";
      data.eventMode = "static";
      data.hitArea = {
        contains: (x, y) => {
          if (dataObj.dragged) return true;
          return Math.hypot(x, y) < 10;
        },
      };
      data.on("pointerdown", (e) => {
        dataObj.dragged = true;
        const { x, y } = e.global;
        dragFloatPreviousPoint.set(x, y);
      });
      data.on("pointermove", function (e) {
        // console.log(app);
        const { x, y } = e.global;
        if (dataObj.dragged) {
          dataObj.xVelocity = x - dragFloatPreviousPoint.x;
          dataObj.yVelocity = y - dragFloatPreviousPoint.y;

          // Dont get out of the screen
          // And don't get into chronicle events
          for (const c of chronicleSprites) {
            const { x: xEvent, y: yEvent } = c.getGlobalPosition();
            if (
              Math.hypot(
                x + dataObj.xVelocity - xEvent,
                y + dataObj.yVelocity - yEvent,
              ) < 18
            ) {
              const rad = Math.atan2(y - yEvent, x - xEvent);
              bubbleContainer.x = xEvent + 18 * Math.cos(rad);
              bubbleContainer.y = yEvent + 18 * Math.sin(rad);
              return;
            }
          }
          if (
            bubbleContainer.x - 7 + dataObj.xVelocity < 0 ||
            bubbleContainer.x + 7 + dataObj.xVelocity > app.screen.width
          ) {
            dataObj.xVelocity = 0;
          } else bubbleContainer.x += dataObj.xVelocity;
          if (
            bubbleContainer.y - 7 + dataObj.yVelocity < 0 ||
            bubbleContainer.y + 7 + dataObj.yVelocity > app.screen.height
          ) {
            dataObj.yVelocity = 0;
          } else bubbleContainer.y += dataObj.yVelocity;
          dragFloatPreviousPoint.set(x, y);
          return;
        }
      });
      data.on("pointerup", function (e) {
        dataObj.dragged = false;
      });
      data.tint = isDark
        ? colors.frappe[i % colors.frappe.length]
        : colors.latte[i % colors.latte.length];
      app.stage.addChild(bubbleContainer);
      i++;
    }
  }
  //#endregion

  //#region Eventloop
  app.ticker.add((time) => {
    // console.log(zodiacAngularVelocity);
    if (!dragTarget)
      container.rotation += zodiacAngularVelocity * time.deltaTime;
    zodiacAngularVelocity *= 0.95;
    for (const [name, dataObj] of floatBubbles) {
      const { container: bubbleContainer, xVelocity, yVelocity } = dataObj;
      if (!dataObj.dragged) {
        bubbleContainer.x += xVelocity * time.deltaTime;
        bubbleContainer.y += yVelocity * time.deltaTime;

        // If near the center, normally slow down
        // If near the edge, fastly slow down
        if (
          bubbleContainer.x < PADDING ||
          bubbleContainer.x > app.screen.width - PADDING
        )
          dataObj.xVelocity *= 0.95;
        else dataObj.xVelocity *= 0.95;
        if (
          bubbleContainer.y < PADDING ||
          bubbleContainer.y > app.screen.height - PADDING
        )
          dataObj.yVelocity *= 0.95;
        else dataObj.yVelocity *= 0.95;

        // Dont get out of the screen
        if (
          bubbleContainer.x - 7 - PADDING < 0 ||
          bubbleContainer.x + 7 + PADDING > app.screen.width
        ) {
          dataObj.xVelocity = 0;
          bubbleContainer.x = Math.max(
            7,
            Math.min(app.screen.width - 7, bubbleContainer.x),
          );
        }
        if (
          bubbleContainer.y - 7 - PADDING < 0 ||
          bubbleContainer.y + 7 + PADDING > app.screen.height
        ) {
          dataObj.yVelocity = 0;
          bubbleContainer.y = Math.max(
            7,
            Math.min(app.screen.height - 7, bubbleContainer.y),
          );
        }

        // Dont get into chronicle events
        let near = false;
        for (const c of chronicleSprites) {
          const { x: xEvent, y: yEvent } = c.getGlobalPosition();
          if (
            Math.hypot(
              bubbleContainer.x + dataObj.xVelocity - xEvent,
              bubbleContainer.y + dataObj.yVelocity - yEvent,
            ) < 16
          ) {
            near = true;
            const rad = Math.atan2(
              bubbleContainer.y - yEvent,
              bubbleContainer.x - xEvent,
            );
            bubbleContainer.x = xEvent + 16 * Math.cos(rad);
            bubbleContainer.y = yEvent + 16 * Math.sin(rad);

            // return;
            // dataObj.xVelocity *= 0.5;
            // dataObj.yVelocity *= 0.5;
            // dataObj.xVelocity = Math.min(2, dataObj.xVelocity);
            // dataObj.yVelocity = Math.min(2, dataObj.yVelocity);
          }
        }

        // And other bubbles...?

        // When near the chronicle events, being attracted
        // Only follows the nearest event
        if (dataObj.events.length !== 0 && !near) {
          // console.log(name, dataObj.events.length);
          const { nearestDistance, nearestRad } = dataObj.events.reduce(
            (accumulator, current) => {
              const { x: xEvent, y: yEvent } = current.getGlobalPosition();
              const rad = Math.atan2(
                bubbleContainer.y - yEvent,
                bubbleContainer.x - xEvent,
              );
              const distance = Math.hypot(
                bubbleContainer.x - xEvent,
                bubbleContainer.y - yEvent,
              );
              if (distance < accumulator.nearestDistance) {
                accumulator.nearestDistance = distance;
                accumulator.nearestRad = rad;
              }
              return accumulator;
            },
            { nearestDistance: Infinity, nearestRad: 0 },
          );
          if (nearestDistance < 60) {
            // Follows Inverse Square Law
            const force = 240 / (nearestDistance * nearestDistance);
            dataObj.xVelocity -= force * Math.cos(nearestRad);
            dataObj.yVelocity -= force * Math.sin(nearestRad);
          }
        }
      }
    }
  });
  //#endregion
}
