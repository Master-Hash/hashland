import Color from "colorjs.io";
import type { Application, Texture } from "pixi.js";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import type { NavigateFunction } from "react-router";
import bubbles from "./bubbles.json" with { type: "json" };
import chronicles from "./chronicles.json" with { type: "json" };
import { colors } from "./colors.ts";
import { BubbleGroup, ChronicleGroup, Zodiac } from "./schemata.ts";

const ZODIAC_SCALE = 0.54;
const ZODIAC_Y_OFFSET = 365;
const SECOND_IN_TROPIC_YEAR = 31556926;
const PADDING = 2;

/**
 * 生成所有对象，并且加载到场景上。
 * 这里只是草稿，毫无疑问后来这些得变成全局的。
 *
 * 如果我们需要把其他系统也写成全局而不是 setup 的内部函数，我们需要一个全局对象
 * 我懒，所以就不写了
 * 反正现在捕获还没有表现出任何弊端
 */
export function setup(ctx: {
  app: Application;
  RAPIER: typeof import("@dimforge/rapier2d");
  texture: Record<string, Texture>;
  isDark: boolean;
  navigate: NavigateFunction;
}) {
  const { app, RAPIER, texture, isDark, navigate } = ctx;
  // #region Zodiac
  // 因为实际组件上都有交互，不适合再添加有交互的子元素，我建议照抄原来的方案
  // 并且 Pixi 8 已经 deprecate 了这种方法
  // Leaf nodes no longer allow children
  // https://pixijs.com/8.x/guides/migrations/v8#deprecated-features
  // 老老实实嵌套 Container！
  const zodiacSprite = Sprite.from(texture["zodiac"]);
  const zodiacContainer = new Container();
  const zodiac = new Zodiac(zodiacContainer, null);
  zodiacContainer.addChild(zodiacSprite);
  app.stage.addChild(zodiacContainer);
  zodiacSprite.anchor.set(0.5);
  zodiacSprite.scale.set(ZODIAC_SCALE);
  zodiacSprite.tint = isDark ? 0xa5adce : 0x6c6f85; // Subtext 0
  zodiacContainer.x = app.screen.width / 2;
  zodiacContainer.y = app.screen.height / 2 + ZODIAC_Y_OFFSET;
  // 之所以是5月，比下面的1月多了4个月
  // 是因为未来的区域一定是空着的，加个偏移可以使现在出现在画面边缘
  zodiacContainer.rotation =
    ((new Date().valueOf() - new Date("2024-05-01").valueOf()) /
      SECOND_IN_TROPIC_YEAR /
      500) *
    Math.PI;
  zodiacSprite.eventMode = "static";
  zodiacSprite.cursor = "pointer";
  // 这玩意显然算声明属性
  zodiacSprite.hitArea = {
    contains: (x, y) => {
      // 我们不希望拖拽时脱手
      if (zodiac.dragTag) {
        return true;
      }
      const d = Math.hypot(x, y);
      const r = 722;
      // console.log(d, r, x, y);
      return d < r + 40 && d > r - 35;
    },
  };
  // 至于 pointermove 嘛……我想好了
  // 这个我来自己维护！算 Kinematic！
  zodiacSprite.on("pointerdown", (e) => {
    zodiac.dragTag = true;
    const { x, y } = e.global;
    // console.log(x, y);
    zodiac.dragPoint.set(x, y);
    zodiac.dragPreviousPoint.set(x, y);
    // 这个留给以后的 system
    // zodiac.angularVelocity = 0;
  });
  // 在原版程序里，角速度 zodiacAngularVelocity
  // 是每帧移动的角度
  // 我这里把这帧和上帧的点击位置都存下来了
  // 具体转了多远，以后的流水线再说

  // 新角度 = 旧角度 + 转动角度
  // 显然没有直接算绝对值的方法
  zodiacSprite.on("pointermove", (e) => {
    // const previousRotate = Math.atan2(
    //   dragPreviousPoint.y - container.y,
    //   dragPreviousPoint.x - container.x,
    // );
    const { x, y } = e.global;
    // const nowRotate = Math.atan2(y - container.y, x - container.x);
    // console.log(
    //   (previousRotate / Math.PI) * 180,
    //   (nowRotate / Math.PI) * 180,
    // );
    // if (zodiac.dragTag) {
    // zodiacAngularVelocity = nowRotate - previousRotate;
    // container.rotation += zodiacAngularVelocity;
    zodiac.dragPoint.set(x, y);
    // return;
    // }
  });
  // 记住，system 结束的时候，把所有 now 写入 previous！

  function onDragEnd() {
    zodiac.dragTag = false;
    zodiac.dragPreviousPoint.set(0, 0);
    zodiac.dragPoint.set(0, 0);
  }
  zodiacSprite.on("pointerup", onDragEnd);
  zodiacSprite.on("pointerupoutside", onDragEnd);
  // #endregion

  // #region Events
  // const eventMap = new Map<string, ChronicleGroup>();
  const events = chronicles.map((c) => {
    const eventContainer = new Container();
    const emojiSprite = Sprite.from(texture[c.emoji]);
    const date = new Date(c.date);
    // 如果 rotation 是零，那么原图正右指向1月1日
    // 故有下面的计算
    // 这里逆时针为正，而 pixi 顺时针为正
    // 所以使用时要取负
    // 但是物理引擎是逆时针为正
    // 麻烦到家了
    const r =
      zodiac.conteneur.y * 0.66 +
      (date.valueOf() - new Date("2024-01-01").valueOf()) / 1000000000;
    const radian =
      ((date.valueOf() / 1000 - new Date("2024-01-01").valueOf() / 1000) /
        SECOND_IN_TROPIC_YEAR) *
      2 *
      Math.PI;
    const color = isDark
      ? new Color(`oklch(69% 0.1 ${4 - radian}rad)`)
      : new Color(`oklch(42% 0.1 ${4 - radian}rad)`);

    const eventDataObj = new ChronicleGroup(
      eventContainer,
      null,
      c.title,
      c.people,
      r,
      radian,
    );
    // 底部靠近圆心而顶部远离圆心
    eventContainer.x = r * Math.cos(-radian);
    eventContainer.y = r * Math.sin(-radian);
    eventContainer.rotation = -radian + Math.PI / 2 + Math.random() - 0.5;
    emojiSprite.anchor.set(0.5);
    emojiSprite.scale.set(0.1);
    emojiSprite.tint = parseInt(
      color.to("srgb").toString({ format: "hex" }).slice(1),
      16,
    );

    eventContainer.eventMode = "static";
    eventContainer.cursor = "pointer";
    eventContainer.hitArea = {
      contains: (x, y) => {
        return Math.hypot(x, y) < 26;
      },
    };

    // label
    const lable = new Text({
      text: c.title,
      style: {
        align: "center",
        fontSize: 13,
        fill: isDark ? 0x85c1dc : 0x209fb5, // Sapphire
      },
    });
    lable.visible = false;
    lable.anchor.set(0.5);
    lable.y = 18;

    eventContainer.on("mouseenter", (e) => {
      lable.visible = true;
    });
    eventContainer.on("mouseleave", (e) => {
      lable.visible = false;
    });

    eventContainer.on("tap", (e) => {
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

    eventContainer.addChild(emojiSprite);
    eventContainer.addChild(lable);
    zodiacContainer.addChild(eventContainer);

    return eventDataObj;
  });

  // #endregion
  // #region Bubbles
  const bubbleMap = new Map<string, BubbleGroup>();
  const floatBubbles = bubbles.map((b, i) => {
    const bubbleContainer = new Container();
    bubbleContainer.x =
      Math.random() * (app.screen.width - PADDING * 2) + PADDING;
    bubbleContainer.y =
      Math.random() * (app.screen.height - PADDING * 2) + PADDING;

    const bubbleGraphics = new Graphics().circle(0, 0, 8).fill(0xffffff);
    bubbleGraphics.cursor = "pointer";
    bubbleGraphics.eventMode = "static";
    bubbleGraphics.tint = isDark
      ? colors.frappe[i % colors.frappe.length]
      : colors.latte[i % colors.latte.length];

    bubbleContainer.addChild(bubbleGraphics);
    const nameText = new Text({
      text: b.name as string,
      style: {
        fill: isDark ? 0xe5c890 : 0xdf8e1d, // Yellow
        fontSize: 13,
        // 非常无奈，Noto Emoji 并不在我的系统可用
        // 不常见本地字体可以用来指纹识别，所以被 Firefox 禁用了
        fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Noto Emoji"',
        align: "center",
      },
    });
    nameText.anchor.set(0.5, 0);
    nameText.y = 8;
    nameText.visible = false;
    nameText.eventMode = "static";
    nameText.cursor = "pointer";
    nameText.on("pointerdown", (e) => {
      if (e.ctrlKey) {
        window
          .open(`/post/人/${b.name}.md`, "_blank", "noopener,noreferrer")
          ?.focus();
      } else {
      void navigate(`/post/人/${b.name}.md`);
      }
    });

    bubbleContainer.addChild(nameText);

    if (b.site !== null) {
      const siteText = new Text({
        text: "✨友链✨",
        style: {
          fill: isDark ? 0xbabbf1 : 0x7287fd, // Lavender
          fontSize: 13,
          fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Noto Emoji"',
          align: "center",
        },
      });
      siteText.anchor.set(0.5, 0);
      siteText.y = 21;
      siteText.visible = false;
      siteText.eventMode = "static";
      siteText.cursor = "pointer";
      siteText.on("pointerdown", () => {
        window.open(b.site as string, "_blank", "noopener,noreferrer")?.focus();
      });
      bubbleContainer.addChild(siteText);
    }

    bubbleContainer.eventMode = "static";
    bubbleContainer.on("mouseenter", () => {
      nameText.visible = true;
      // console.log(container);
      if (b.site !== null) {
        bubbleContainer.children.at(-1)!.visible = true;
      }
    });
    bubbleContainer.on("mouseleave", () => {
      nameText.visible = false;
      if (b.site !== null) {
        bubbleContainer.children.at(-1)!.visible = false;
      }
    });
    bubbleContainer.on("tap", () => {
      nameText.visible = true;
      if (b.site !== null) {
        bubbleContainer.children.at(-1)!.visible = true;
      }
      setTimeout(() => {
        nameText.visible = false;
        if (b.site !== null) {
          bubbleContainer.children.at(-1)!.visible = false;
        }
      }, 800);
    });

    const floating = new BubbleGroup(
      bubbleContainer,
      null,
      b.name as string,
      [],
    );

    bubbleGraphics.hitArea = {
      contains: (x, y) => {
        if (floating.dragTag) return true;
        return Math.hypot(x, y) < 10;
      },
    };

    // Todo 一大堆 Graphics 的事件

    return floating;
  });

  floatBubbles.forEach((b) => {
    app.stage.addChild(b.conteneur);
    bubbleMap.set(b.name, b);
  });

  events.forEach((e) => {
    zodiac.conteneur.addChild(e.conteneur);
    e.people.forEach((p) => {
      bubbleMap.get(p)?.attractedBy.push(e);
    });
  });
  // #endregion
}
