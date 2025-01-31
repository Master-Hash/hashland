import Color from "colorjs.io";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import bubbles from "./bubbles.json" with { type: "json" };
import chronicles from "./chronicles.json" with { type: "json" };
import { colors } from "./colors.ts";
import type { Context } from "./schemata.ts";
import { BubbleGroup, ChronicleGroup, Zodiac } from "./schemata.ts";

const ZODIAC_SCALE = 0.54;
const ZODIAC_Y_OFFSET = 365;
const SECOND_IN_TROPIC_YEAR = 31556926;
const PADDING = 15;
const DAMPING = 0.95;
const REST_LENGTH = 0.0001;
const STIFFNESS = 100000000;
const SPRING_DAMPING = 10000000;
const BUBBLE_STIFFNESS = 80000;
const BUBBLE_DAMPING = 9000;
const GRAVITY = 481000;
const ZODIAC_MASS = 99999999999;

const COLLIDER_GROUP_1 = 0x00010002;
const COLLIDER_GROUP_2 = 0x00020003;

/**
 * 生成所有对象，并且加载到场景上。
 * 这里只是草稿，毫无疑问后来这些得变成全局的。
 *
 * 如果我们需要把其他系统也写成全局而不是 setup 的内部函数，我们需要一个全局对象
 * 我懒，所以就不写了
 * 反正现在捕获还没有表现出任何弊端
 */
export function setup(ctx: Context) {
  // #region Rapier init
  const { app, RAPIER, texture, isDark, navigate } = ctx;
  // 别想了！
  // app.stage.scale.set(1, -1);
  // 官方做法是用负数，但不用减法
  // 我先试一试不转换坐标系行不行
  // 反正负负得正
  const world = new RAPIER.World({ x: 0, y: 0 });
  globalThis.world = world;
  const wallLeftColliderDesc = RAPIER.ColliderDesc.cuboid(
    PADDING / 2,
    (app.screen.height - PADDING) / 2,
  )
    .setTranslation(PADDING / 2, app.screen.height / 2)
    .setCollisionGroups(COLLIDER_GROUP_1);
  const wallLeftCollider = world.createCollider(wallLeftColliderDesc);
  const wallRightColliderDesc = RAPIER.ColliderDesc.cuboid(
    PADDING / 2,
    (app.screen.height - PADDING) / 2,
  )
    .setTranslation(app.screen.width - PADDING / 2, app.screen.height / 2)
    .setCollisionGroups(COLLIDER_GROUP_1);
  const wallRightCollider = world.createCollider(wallRightColliderDesc);
  const wallTopColliderDesc = RAPIER.ColliderDesc.cuboid(
    (app.screen.width - PADDING) / 2,
    PADDING / 2,
  )
    .setTranslation(app.screen.width / 2, PADDING / 2)
    .setCollisionGroups(COLLIDER_GROUP_1);
  const wallTopCollider = world.createCollider(wallTopColliderDesc);
  const wallBottomColliderDesc = RAPIER.ColliderDesc.cuboid(
    (app.screen.width - PADDING) / 2,
    PADDING / 2,
  )
    .setTranslation(app.screen.width / 2, app.screen.height - PADDING / 2)
    .setCollisionGroups(COLLIDER_GROUP_1);
  const wallBottomCollider = world.createCollider(wallBottomColliderDesc);
  const pointerRigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased();
  const pointerRigidBody = world.createRigidBody(pointerRigidBodyDesc);

  // const texture = (await loadTexture()) as Record<string, Texture>;
  // #endregion
  // #region Zodiac
  // 因为实际组件上都有交互，不适合再添加有交互的子元素，我建议照抄原来的方案
  // 并且 Pixi 8 已经 deprecate 了这种方法
  // Leaf nodes no longer allow children
  // https://pixijs.com/8.x/guides/migrations/v8#deprecated-features
  // 老老实实嵌套 Container！
  const zodiacSprite = Sprite.from(texture["zodiac"]);
  const zodiacContainer = new Container();

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
  const zodiacRigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(zodiacContainer.x, zodiacContainer.y)
    .lockTranslations()
    // .setAdditionalMass(1)
    .setAdditionalMassProperties(0, { x: 0, y: 0 }, ZODIAC_MASS)
    .setAngularDamping(DAMPING)
    .setRotation(zodiacContainer.rotation);
  const zodiacRigidBody = world.createRigidBody(zodiacRigidBodyDesc);
  const zodiac = new Zodiac(zodiacContainer, zodiacRigidBody);
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
  zodiacSprite.on("pointerdown", (e) => {
    zodiac.dragTag = true;
    const { x, y } = e.getLocalPosition(zodiacContainer);
    const params = RAPIER.JointData.spring(
      REST_LENGTH,
      STIFFNESS,
      SPRING_DAMPING,
      { x, y },
      { x: 0, y: 0 },
    );
    // const params = RAPIER.JointData.rope(20, { x, y }, { x: 0, y: 0 });
    pointerRigidBody.setTranslation(e.global, true);
    const joint = world.createImpulseJoint(
      params,
      zodiacRigidBody,
      pointerRigidBody,
      true,
    );
    // console.log(joint);
    zodiac.joint = joint;
    // console.log(x, y);
    const r = Math.hypot(
      e.global.x - zodiacContainer.x,
      e.global.y - zodiacContainer.y,
    );
    zodiac.r = r;
  });

  zodiacSprite.on("pointermove", (e) => {
    if (zodiac.dragTag) {
      const theta = Math.atan2(
        e.global.y - zodiacContainer.y,
        e.global.x - zodiacContainer.x,
      );
      pointerRigidBody.setTranslation(
        {
          x: zodiacContainer.x + zodiac.r * Math.cos(theta),
          y: zodiacContainer.y + zodiac.r * Math.sin(theta),
        },
        true,
      );
    }
  });

  function onDragEnd() {
    world.removeImpulseJoint(zodiac.joint!, true);
    zodiac.dragTag = false;
  }
  zodiacSprite.on("pointerup", onDragEnd);
  zodiacSprite.on("pointerupoutside", onDragEnd);
  // #endregion

  // #region Events
  const events = chronicles.map((c) => {
    const eventContainer = new Container();
    const emojiSprite = Sprite.from(texture[c.emoji]);
    const date = new Date(c.date);
    // 如果 rotation 是零，那么原图正右指向1月1日
    // 故有下面的计算
    // 这里逆时针为正，而 pixi 顺时针为正
    // 所以使用时要取负
    // 但是物理引擎是逆时针为正
    // 但是没关系，我们不做任何坐标变换
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

    const emojiColliderDesc = RAPIER.ColliderDesc.ball(14)
      .setDensity(0)
      .setTranslation(r * Math.cos(-radian), r * Math.sin(-radian))
      .setCollisionGroups(COLLIDER_GROUP_1);
    const emojiCollider = world.createCollider(
      emojiColliderDesc,
      zodiacRigidBody,
    );

    const eventDataObj = new ChronicleGroup(
      eventContainer,
      emojiCollider,
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
    const x = Math.random() * (app.screen.width - PADDING * 2) + PADDING,
      y = Math.random() * (app.screen.height - PADDING * 2) + PADDING;
    const bubbleRigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .lockRotations()
      .setLinearDamping(DAMPING)
      .setCcdEnabled(true)
      .setTranslation(x, y);
    const bubbleRigidBody = world.createRigidBody(bubbleRigidBodyDesc);
    const bubbleColliderDesc = RAPIER.ColliderDesc.ball(8)
      .setDensity(1)
      .setCollisionGroups(COLLIDER_GROUP_2);
    const bubbleCollider = world.createCollider(
      bubbleColliderDesc,
      bubbleRigidBody,
    );
    bubbleContainer.x = x;
    bubbleContainer.y = y;

    const bubbleGraphics = new Graphics().circle(0, 0, 8).fill(0xffffff);
    bubbleGraphics.cursor = "pointer";
    bubbleGraphics.eventMode = "static";
    bubbleGraphics.tint = isDark
      ? colors.frappe[i % colors.frappe.length]
      : colors.latte[i % colors.latte.length];

    bubbleContainer.addChild(bubbleGraphics);
    const nameText = new Text({
      text: b.name,
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
    nameText.on("pointerup", (e) => {
      // console.log("??????");
      if (floating.joint !== null) {
        world.removeImpulseJoint(floating.joint, true);
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
        window.open(b.site, "_blank", "noopener,noreferrer")?.focus();
      });
      siteText.on("pointerup", (e) => {
        // console.log("??????");
        if (floating.joint !== null) {
          world.removeImpulseJoint(floating.joint, true);
        }
      });
      bubbleContainer.addChild(siteText);
    }

    console.log(bubbleCollider.mass());

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
      bubbleRigidBody,
      b.name,
      [],
    );

    bubbleGraphics.hitArea = {
      contains: (x, y) => {
        if (floating.dragTag) return true;
        return Math.hypot(x, y) < 10;
      },
    };

    bubbleGraphics.on("pointerdown", (e) => {
      console.log("point down");
      floating.dragTag = true;
      const { x, y } = e.getLocalPosition(bubbleGraphics);
      const params = RAPIER.JointData.spring(
        REST_LENGTH,
        BUBBLE_STIFFNESS,
        BUBBLE_DAMPING,
        { x, y },
        { x: 0, y: 0 },
      );
      pointerRigidBody.setTranslation(e.global, true);
      const joint = world.createImpulseJoint(
        params,
        bubbleRigidBody,
        pointerRigidBody,
        true,
      );
      floating.joint = joint;
    });
    bubbleGraphics.on("pointermove", (e) => {
      if (floating.dragTag) {
        pointerRigidBody.setTranslation(e.global, true);
      }
    });
    bubbleGraphics.on("pointerup", (e) => {
      console.log("point up");
      floating.dragTag = false;
      world.removeImpulseJoint(floating.joint!, true);
      floating.joint = null;
    });

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

  // floatBubbles.forEach((b) => {
  //   console.log(b.attractedBy);
  // });

  // #endregion
  // zodiacRigidBody.setAdditionalMass(0.1, true);
  console.log(zodiacRigidBody.mass());

  // #region Eventloop
  app.ticker.add(
    (time) => {
      zodiacRigidBody.resetForces(true);
      floatBubbles.forEach((b) => {
        b.rigid.resetForces(true);
        b.attractedBy.forEach((e) => {
          const { x: ex, y: ey } = e.conteneur.getGlobalPosition();
          const dx = ex - b.rigid.translation().x;
          const dy = ey - b.rigid.translation().y;
          const distance = Math.hypot(dx, dy);
          const force = (GRAVITY * b.rigid.mass() * 1) / Math.pow(distance, 2);
          b.rigid.addForce(
            { x: (force * dx) / distance, y: (force * dy) / distance },
            true,
          );
          // 不符合牛顿第三定律？
          // 我不符合的东西还多了呢，不差你
          // 主要是 bug 修不来了OwO
          // zodiacRigidBody.addForceAtPoint(
          //   { x: (-force * dx) / distance, y: (-force * dy) / distance },
          //   { x: ex, y: ey },
          //   true,
          // );
        });
      });
    },
    undefined,
    10,
  );
  app.ticker.add(
    (time) => {
      world.step();
    },
    undefined,
    5,
  );
  app.ticker.add(
    (time) => {
      zodiac.conteneur.rotation = zodiacRigidBody.rotation();
      floatBubbles.forEach((b) => {
        b.conteneur.x = b.rigid.translation().x;
        b.conteneur.y = b.rigid.translation().y;
      });
      // console.log(pointerRigidBody.translation(), zodiac.joint);
    },
    undefined,
    4,
  );
  // #endregion
}
