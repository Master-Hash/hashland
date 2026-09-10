import type { FederatedPointerEvent } from "pixi.js";
import { Container, Graphics, Rectangle, Sprite, Text } from "pixi.js";
import DARK from "virtual:dark";
import LIGHT from "virtual:light";

import bubbles from "./bubbles.json" with { type: "json" };
import chronicles from "./chronicles.json" with { type: "json" };
import { colors } from "./colors.ts";
import { JointData } from "./rapier2d/dynamics/impulse_joint.js";
import { RigidBodyDesc } from "./rapier2d/dynamics/rigid_body.js";
import { ColliderDesc } from "./rapier2d/geometry/collider.js";
import type { Context, DragTag, FocusTag } from "./schemata.ts";
import { BubbleGroup, ChronicleGroup, Zodiac } from "./schemata.ts";

const ZODIAC_SCALE = 0.54;
const ZODIAC_Y_OFFSET = 365;
const SECOND_IN_TROPIC_YEAR = 31556926;
const PADDING = 4;
const DAMPING = 0.95;
const REST_LENGTH = 0.0001;
const STIFFNESS = 1e8;
const SPRING_DAMPING = 1e7;
const BUBBLE_DAMPING = 24;
const BUBBLE_FREE_DAMPING = 1;
const BUBBLE_STIFFNESS = 60000;
const BUBBLE_STRING_DAMPING = 2;
const GRAVITY = 441000;
const ZODIAC_ANGULAR_INERTIA = 1e8;
const WALL_RESTITUTION = 0.35;
const DOLPHIN_WALL_RESTITUTION = 2;
let DOLPHIN_ENABLED = false;

const COLLIDER_GROUP_1 = 0x00010002;
const COLLIDER_GROUP_2 = 0x00020003;

const GAMEPAD_STICK_AXIS_X = 2; // 大多数手柄 axes[2]/[3] 是右摇杆，具体需按实际设备核对
const GAMEPAD_STICK_AXIS_Y = 3;
const GAMEPAD_STICK_EDGE_THRESHOLD = 0.9; // 视为"推到最边缘"的阈值
// 左摇杆用于焦点导航，标准映射下是 axes[0]/[1]
const GAMEPAD_NAVIGATION_STICK_AXIS_X = 0;
const GAMEPAD_NAVIGATION_STICK_AXIS_Y = 1;
// 焦点导航允许的最大偏角
const GAMEPAD_NAVIGATION_MAX_ANGLE = Math.PI / 3;

const GAMEPAD_BUTTON_A = 0;
const GAMEPAD_BUTTON_Y = 3;
const GAMEPAD_BUTTON_DPAD_UP = 12;
const GAMEPAD_BUTTON_DPAD_DOWN = 13;
const GAMEPAD_BUTTON_DPAD_LEFT = 14;
const GAMEPAD_BUTTON_DPAD_RIGHT = 15;
const AYU_SEQUENCE = [
  GAMEPAD_BUTTON_A,
  GAMEPAD_BUTTON_Y,
  GAMEPAD_BUTTON_DPAD_UP,
] as const;
let prevButtonsPressed = new Set<number>();
let ayuStep = 0; // 已经正确按到序列的第几步了

function navigate(to: string) {
  if ("navigation" in window) {
    window.navigation.navigate(to);
  } else {
    location.href = to;
  }
}

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
  const { app, world, texture, isDark } = ctx;
  // console.log(JSON.stringify(colors));
  // 别想了！
  // app.stage.scale.set(1, -1);
  // 官方做法是用负数，但不用减法
  // 我先试一试不转换坐标系行不行
  // 反正负负得正
  let currentPointerDown = null as DragTag | null;
  let gamepadDragging = false;
  // #region Focus
  // 同一时间只允许一个对象处于 focus 状态
  let focusedTag: FocusTag | null = null;
  const focusCallbacks = new Map<FocusTag, (focused: boolean) => void>();

  function applyFocus(target: FocusTag, focused: boolean) {
    target.focusTag = focused;
    focusCallbacks.get(target)?.(focused);
  }

  function setFocus(target: FocusTag | null) {
    if (focusedTag === target) return;
    if (focusedTag) {
      applyFocus(focusedTag, false);
    }
    focusedTag = target;
    if (focusedTag) {
      applyFocus(focusedTag, true);
    }
  }

  function toggleFocus(target: FocusTag) {
    setFocus(focusedTag === target ? null : target);
  }

  // 点击空白处取消 focus
  app.stage.eventMode = "static";
  app.stage.hitArea = new Rectangle(0, 0, app.screen.width, app.screen.height);
  app.stage.on("pointerdown", (e) => {
    if (e.button !== 0) return;
    setFocus(null);
  });
  // #endregion
  const wallLeftColliderDesc = ColliderDesc.cuboid(
    PADDING / 2,
    (app.screen.height - PADDING) / 2,
  )
    .setTranslation(PADDING / 2, app.screen.height / 2)
    .setCollisionGroups(COLLIDER_GROUP_1)
    .setRestitution(WALL_RESTITUTION);
  const wallLeftCollider = world.createCollider(wallLeftColliderDesc);
  const wallRightColliderDesc = ColliderDesc.cuboid(
    PADDING / 2,
    (app.screen.height - PADDING) / 2,
  )
    .setTranslation(app.screen.width - PADDING / 2, app.screen.height / 2)
    .setCollisionGroups(COLLIDER_GROUP_1)
    .setRestitution(WALL_RESTITUTION);
  const wallRightCollider = world.createCollider(wallRightColliderDesc);
  const wallTopColliderDesc = ColliderDesc.cuboid(
    (app.screen.width - PADDING) / 2,
    PADDING / 2,
  )
    .setTranslation(app.screen.width / 2, PADDING / 2)
    .setCollisionGroups(COLLIDER_GROUP_1)
    .setRestitution(WALL_RESTITUTION);
  const wallTopCollider = world.createCollider(wallTopColliderDesc);
  const wallBottomColliderDesc = ColliderDesc.cuboid(
    (app.screen.width - PADDING) / 2,
    PADDING / 2,
  )
    .setTranslation(app.screen.width / 2, app.screen.height - PADDING / 2)
    .setCollisionGroups(COLLIDER_GROUP_1)
    .setRestitution(WALL_RESTITUTION);
  const wallBottomCollider = world.createCollider(wallBottomColliderDesc);
  const pointerRigidBodyDesc = RigidBodyDesc.kinematicPositionBased();
  const pointerRigidBody = world.createRigidBody(pointerRigidBodyDesc);

  app.stage.on("dolphin", () => {
    if (!DOLPHIN_ENABLED) {
      wallLeftCollider.setRestitution(DOLPHIN_WALL_RESTITUTION);
      wallRightCollider.setRestitution(DOLPHIN_WALL_RESTITUTION);
      wallTopCollider.setRestitution(DOLPHIN_WALL_RESTITUTION);
      wallBottomCollider.setRestitution(DOLPHIN_WALL_RESTITUTION);
      DOLPHIN_ENABLED = true;
    } else {
      wallLeftCollider.setRestitution(WALL_RESTITUTION);
      wallRightCollider.setRestitution(WALL_RESTITUTION);
      wallTopCollider.setRestitution(WALL_RESTITUTION);
      wallBottomCollider.setRestitution(WALL_RESTITUTION);
      DOLPHIN_ENABLED = false;
    }
  });

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
  const zodiacRigidBodyDesc = RigidBodyDesc.dynamic()
    .setTranslation(zodiacContainer.x, zodiacContainer.y)
    .lockTranslations()
    // .setAdditionalMass(1)
    .setAdditionalMassProperties(0, { x: 0, y: 0 }, ZODIAC_ANGULAR_INERTIA)
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
    if (currentPointerDown === null) {
      currentPointerDown = zodiac;
      zodiac.dragTag = true;
      const { x, y } = e.getLocalPosition(zodiacContainer);
      const params = JointData.spring(
        REST_LENGTH,
        STIFFNESS,
        SPRING_DAMPING,
        { x, y },
        { x: 0, y: 0 },
      );
      pointerRigidBody.setTranslation(e.global, true);
      const joint = world.createImpulseJoint(
        params,
        zodiacRigidBody,
        pointerRigidBody,
        true,
      );
      currentPointerDown.joint = joint;
      const r = Math.hypot(
        e.global.x - zodiacContainer.x,
        e.global.y - zodiacContainer.y,
      );
      zodiac.r = r;
    }
  });

  zodiacSprite.on("pointermove", (e) => {
    if (currentPointerDown === zodiac) {
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

  function onDragEnd(e: FederatedPointerEvent) {
    // 虽然没发生过，但实际上是谁都有可能！
    if (currentPointerDown !== null) {
      console.log("remove joint happens on", e);
      world.removeImpulseJoint(currentPointerDown.joint!, true);
      currentPointerDown.dragTag = false;
      currentPointerDown.joint = null;
      if (currentPointerDown instanceof BubbleGroup) {
        currentPointerDown.rigid.setLinearDamping(BUBBLE_FREE_DAMPING);
      }
      currentPointerDown = null;
    }
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
      zodiac.conteneur.y * 0.72 +
      (date.valueOf() - new Date("2024-01-01").valueOf()) / 3000000000;
    const radian =
      ((date.valueOf() / 1000 - new Date("2024-01-01").valueOf() / 1000) /
        SECOND_IN_TROPIC_YEAR) *
      2 *
      Math.PI;
    // const color = isDark
    //   ? new Color(`oklch(69% 0.1 ${4 - radian}rad)`)
    //   : new Color(`oklch(42% 0.1 ${4 - radian}rad)`);

    const emojiColliderDesc = ColliderDesc.ball(14)
      .setDensity(0)
      .setTranslation(r * Math.cos(-radian), r * Math.sin(-radian))
      .setCollisionGroups(COLLIDER_GROUP_1)
      .setRestitution(0.35);
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
    emojiSprite.tint = isDark ? DARK[c.date] : LIGHT[c.date];

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
        fontFamily:
          '"Noto Sans SC", "SEC CJK SC", "PingFang SC", ui-sans-serif, system-ui, sans-serif, "Noto Emoji"',
        fill: isDark ? 0x85c1dc : 0x209fb5, // Sapphire
      },
    });
    lable.visible = false;
    lable.anchor.set(0.5);
    lable.y = 25;

    const focusRing = new Graphics().circle(0, 0, 17).stroke({
      color: isDark ? 0xa5adce : 0x6c6f85, // Subtext 0
      width: 2,
    });
    focusRing.visible = false;

    eventContainer.on("pointerdown", (e) => {
      if (e.button !== 0) return;
      toggleFocus(eventDataObj);
      e.stopPropagation();
    });

    lable.eventMode = "static";
    lable.cursor = "pointer";
    lable.on("pointerdown", (e) => {
      // test if `c.alt` is full URL
      const outURL = URL.parse(c.alt!);
      if (outURL !== null) {
        window.open(c.alt, "_blank")?.focus();
      } else {
        const t = "alt" in c ? c.alt : `/事/${c.date}_${c.title}.md`;
        console.log("fuck", t);
        if (e.ctrlKey || e.metaKey || e.button === 1) {
          window.open(t, "_blank")?.focus();
        } else {
          navigate(t!);
        }
      }
    });

    eventContainer.addChild(focusRing);
    eventContainer.addChild(emojiSprite);
    eventContainer.addChild(lable);
    focusCallbacks.set(eventDataObj, (focused) => {
      lable.visible = focused;
      focusRing.visible = focused;
    });
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
    const bubbleRigidBodyDesc = RigidBodyDesc.dynamic()
      .lockRotations()
      .setLinearDamping(BUBBLE_FREE_DAMPING)
      .setCcdEnabled(true)
      .setTranslation(x, y);
    const bubbleRigidBody = world.createRigidBody(bubbleRigidBodyDesc);
    const bubbleColliderDesc = ColliderDesc.ball(8)
      .setDensity(1)
      .setCollisionGroups(COLLIDER_GROUP_2)
      .setRestitution(0.8);
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
    const focusRing = new Graphics().circle(0, 0, 11).stroke({
      color: isDark ? 0xa5adce : 0x6c6f85, // Subtext 0
      width: 2,
    });
    focusRing.visible = false;
    bubbleContainer.addChild(focusRing);
    const nameText = new Text({
      text: b.name,
      style: {
        fill: isDark ? 0xe5c890 : 0xdf8e1d, // Yellow
        fontSize: 13,
        // 非常无奈，Noto Emoji 并不在我的系统可用
        // 不常见本地字体可以用来指纹识别，所以被 Firefox 禁用了
        fontFamily:
          '"Noto Sans SC", "SEC CJK SC", "PingFang SC", ui-sans-serif, system-ui, sans-serif, "Noto Emoji"',
        align: "center",
      },
    });
    nameText.anchor.set(0.5, 0);
    nameText.y = 10;
    nameText.visible = false;
    nameText.eventMode = "static";
    nameText.cursor = "pointer";
    nameText.on("pointerdown", (e) => {
      if (e.ctrlKey || e.metaKey || e.button === 1) {
        window.open(`/人/${b.name}.md`, "_blank")?.focus();
      } else {
        navigate(`/人/${b.name}.md`);
      }
    });

    bubbleContainer.addChild(nameText);

    let siteText: Text | null = null;
    if (b.site !== null) {
      siteText = new Text({
        text: "✨友链✨",
        style: {
          fill: isDark ? 0xbabbf1 : 0x7287fd, // Lavender
          fontSize: 13,
          fontFamily:
            '"Noto Sans SC", "SEC CJK SC", "PingFang SC", ui-sans-serif, system-ui, sans-serif, "Noto Emoji"',
          align: "center",
        },
      });
      siteText.anchor.set(0.5, 0);
      siteText.y = 23;
      siteText.visible = false;
      siteText.eventMode = "static";
      siteText.cursor = "pointer";
      siteText.on("pointerdown", () => {
        window.open(b.site, "_blank")?.focus();
      });
      bubbleContainer.addChild(siteText);
    }

    console.log(bubbleCollider.mass());

    bubbleContainer.eventMode = "static";

    const floating = new BubbleGroup(
      bubbleContainer,
      bubbleRigidBody,
      b.name,
      [],
    );

    bubbleContainer.on("pointerdown", (e) => {
      if (e.button !== 0) return;
      toggleFocus(floating);
      e.stopPropagation();
    });

    focusCallbacks.set(floating, (focused) => {
      nameText.visible = focused;
      if (siteText) siteText.visible = focused;
      focusRing.visible = focused;
    });

    bubbleGraphics.hitArea = {
      contains: (x, y) => {
        if (floating.dragTag) return true;
        return Math.hypot(x, y) < 10;
      },
    };

    bubbleGraphics.on("pointerdown", (e) => {
      console.log("point down");
      if (currentPointerDown === null) {
        currentPointerDown = floating;
        floating.dragTag = true;
        const { x, y } = e.getLocalPosition(bubbleGraphics);
        const params = JointData.spring(
          REST_LENGTH,
          BUBBLE_STIFFNESS,
          BUBBLE_STRING_DAMPING,
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
        bubbleRigidBody.setLinearDamping(BUBBLE_DAMPING);
      }
    });
    bubbleGraphics.on("pointermove", (e) => {
      if (currentPointerDown === floating) {
        pointerRigidBody.setTranslation(e.global, true);
      }
    });
    bubbleGraphics.on("pointerup", (e) => {
      onDragEnd(e);
    });
    bubbleGraphics.on("pointerupoutside", (e) => {
      onDragEnd(e);
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

  // #region GamePads
  // 手柄方向键/左摇杆切换焦点
  // 方向键支持八方向，但一次按住只触发一次，全部松开前不再移动
  let dpadLatched = false;
  let stickEngaged = false;

  const focusTargets: FocusTag[] = [...events, ...floatBubbles];

  function normalizeAngle(angle: number) {
    return Math.atan2(Math.sin(angle), Math.cos(angle));
  }

  // 从 from 出发，沿 (dirX, dirY) 方向寻找最合适的焦点
  // 综合考虑偏角与距离；当前无焦点时以屏幕中心为起点
  function findNextFocus(from: FocusTag | null, dirX: number, dirY: number) {
    const dirAngle = Math.atan2(dirY, dirX);
    const origin = from
      ? from.conteneur.getGlobalPosition()
      : { x: app.screen.width / 2, y: app.screen.height / 2 };
    let best: FocusTag | null = null;
    let bestScore = Infinity;

    for (const target of focusTargets) {
      if (target === from) continue;
      const position = target.conteneur.getGlobalPosition();
      // 忽略已经离开屏幕的目标
      if (
        position.x < 0 ||
        position.x > app.screen.width ||
        position.y < 0 ||
        position.y > app.screen.height
      ) {
        continue;
      }
      const dx = position.x - origin.x;
      const dy = position.y - origin.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 1e-3) continue;
      const diff = normalizeAngle(Math.atan2(dy, dx) - dirAngle);
      if (Math.abs(diff) > GAMEPAD_NAVIGATION_MAX_ANGLE) continue;
      // 偏角越大、距离越远，代价越高
      const score = distance / Math.cos(diff);
      if (score < bestScore) {
        bestScore = score;
        best = target;
      }
    }

    return best;
  }

  function navigateFocus(dirX: number, dirY: number) {
    const next = findNextFocus(focusedTag, dirX, dirY);
    // 目标方向没有物体时保持当前焦点
    if (next !== null) {
      setFocus(next);
    }
  }

  app.ticker.add(
    () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0];
      if (!gamepad) {
        prevButtonsPressed.clear();
        ayuStep = 0;
        dpadLatched = false;
        stickEngaged = false;
        return;
      }

      // 不考虑多手柄
      let gX = 0;
      let gY = 0;
      let magnitude = 0;

      gX = gamepad.axes[GAMEPAD_STICK_AXIS_X] ?? 0;
      gY = gamepad.axes[GAMEPAD_STICK_AXIS_Y] ?? 0;
      magnitude = Math.hypot(gX, gY);

      if (magnitude >= GAMEPAD_STICK_EDGE_THRESHOLD) {
        // 摇杆方向即为拖拽方向
        const theta = Math.atan2(gY, gX);

        if (!gamepadDragging) {
          // 和 pointerdown 类似：只有没人在拖别的东西时才接管
          if (currentPointerDown === null) {
            gamepadDragging = true;
            currentPointerDown = zodiac;
            zodiac.dragTag = true;
            const r = 722; // 与 hitArea 里用的半径一致
            zodiac.r = r;
            const global = {
              x: zodiacContainer.x + r * Math.cos(theta),
              y: zodiacContainer.y + r * Math.sin(theta),
            };
            const local = zodiacContainer.toLocal(global);
            const params = JointData.spring(
              REST_LENGTH,
              STIFFNESS,
              SPRING_DAMPING,
              local,
              { x: 0, y: 0 },
            );
            pointerRigidBody.setTranslation(global, true);
            const joint = world.createImpulseJoint(
              params,
              zodiacRigidBody,
              pointerRigidBody,
              true,
            );
            currentPointerDown.joint = joint;
          }
        } else if (currentPointerDown === zodiac) {
          // 和 pointermove 一致：沿固定半径更新目标位置
          pointerRigidBody.setTranslation(
            {
              x: zodiacContainer.x + zodiac.r * Math.cos(theta),
              y: zodiacContainer.y + zodiac.r * Math.sin(theta),
            },
            true,
          );
        }
      } else if (gamepadDragging) {
        // 摇杆回到边缘以内，相当于松手
        if (currentPointerDown !== null) {
          world.removeImpulseJoint(currentPointerDown.joint!, true);
          currentPointerDown.dragTag = false;
          currentPointerDown.joint = null;
          // if (currentPointerDown instanceof BubbleGroup) {
          //   currentPointerDown.rigid.setLinearDamping(BUBBLE_FREE_DAMPING);
          // }
          currentPointerDown = null;
        }
        gamepadDragging = false;
      }

      // 方向键：八方向，本帧按下的组合即方向；
      // 一旦触发就闩锁，必须全部松开才能再移动，方向中途变化不再触发
      const dpadX =
        (gamepad.buttons[GAMEPAD_BUTTON_DPAD_RIGHT]?.pressed ? 1 : 0) -
        (gamepad.buttons[GAMEPAD_BUTTON_DPAD_LEFT]?.pressed ? 1 : 0);
      const dpadY =
        (gamepad.buttons[GAMEPAD_BUTTON_DPAD_DOWN]?.pressed ? 1 : 0) -
        (gamepad.buttons[GAMEPAD_BUTTON_DPAD_UP]?.pressed ? 1 : 0);
      let navigated = false;
      if (dpadX === 0 && dpadY === 0) {
        // 全部松开，解除闩锁
        dpadLatched = false;
      } else if (!dpadLatched) {
        navigateFocus(dpadX, dpadY);
        navigated = true;
        dpadLatched = true;
      }

      // 左摇杆：任意方向，越过阈值时只触发一次
      const navX = gamepad.axes[GAMEPAD_NAVIGATION_STICK_AXIS_X] ?? 0;
      const navY = gamepad.axes[GAMEPAD_NAVIGATION_STICK_AXIS_Y] ?? 0;
      const navMagnitude = Math.hypot(navX, navY);
      if (navMagnitude >= GAMEPAD_STICK_EDGE_THRESHOLD) {
        if (!stickEngaged) {
          stickEngaged = true;
          if (!navigated) {
            navigateFocus(navX / navMagnitude, navY / navMagnitude);
          }
        }
      } else {
        stickEngaged = false;
      }

      // 手柄秘籍
      const currentButtonsPressed = new Set<number>();
      gamepad.buttons.forEach((b, i) => {
        if (b.pressed) currentButtonsPressed.add(i);
      });
      // console.log(currentButtonsPressed, ayuStep);

      // 找出这一帧“刚按下”的所有键
      for (let i = 0; i < gamepad.buttons.length; i++) {
        const justPressed =
          currentButtonsPressed.has(i) && !prevButtonsPressed.has(i);
        if (!justPressed) continue;

        const expected = AYU_SEQUENCE[ayuStep];
        if (i === expected) {
          // 按对了，进入下一步
          ayuStep++;
          if (ayuStep === AYU_SEQUENCE.length) {
            app.stage.emit("dolphin");
            ayuStep = 0;
          }
        } else if (i === AYU_SEQUENCE[0]) {
          // 按错了，但这个键恰好是序列的第一个键（A），可以重新开始计
          ayuStep = 1;
        } else {
          // 按了不相干的键，序列作废
          ayuStep = 0;
        }
      }

      prevButtonsPressed = currentButtonsPressed;
    },
    undefined,
    20,
  );
  // #endregion
  // #region Eventloop
  app.ticker.add(
    () => {
      floatBubbles.forEach((b) => {
        const x = Math.random() * (app.screen.width - PADDING * 2) + PADDING,
          y = Math.random() * (app.screen.height - PADDING * 2) + PADDING;
        const { x: bx, y: by } = b.conteneur.position;
        // 如果在屏幕外，就有小概率传送回来
        if (
          (bx > app.screen.width ||
            bx < 0 ||
            by > app.screen.height ||
            by < 0) &&
          Math.random() < 1 / 240 &&
          b.dragTag === false
        ) {
          b.rigid.setTranslation({ x, y }, true);
        }
      });
    },
    undefined,
    11,
  );
  app.ticker.add(
    (time) => {
      zodiacRigidBody.resetForces(true);
      zodiacRigidBody.resetTorques(true);
      floatBubbles.forEach((b) => {
        b.rigid.resetForces(true);
        b.attractedBy.forEach((e) => {
          const o = e.conteneur.getGlobalPosition();
          const t = b.conteneur.position;
          const dx = o.x - t.x;
          const dy = o.y - t.y;
          const distanceSquared = dx * dx + dy * dy;
          const distance = Math.sqrt(distanceSquared);
          const force = (GRAVITY * b.rigid.mass() * 1) / distanceSquared,
            fx = (force * dx) / distance,
            fy = (force * dy) / distance;
          b.rigid.addForce({ x: fx, y: fy }, true);
          // 牛顿第三定律
          zodiacRigidBody.addForceAtPoint({ x: -fx, y: -fy }, o, true);
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
        // 如果移动太小，则不予更新
        // 但是渲染引擎有次像素渲染，这样会导致量子化移动，不好
        // const dx = b.rigid.translation().x - b.conteneur.x,
        //   dy = b.rigid.translation().y - b.conteneur.y;
        // if (dx * dx + dy * dy < 0.5) {
        //   return;
        // }
        b.rigid.translation(b.conteneur);
      });
      // console.log(pointerRigidBody.translation(), zodiac.joint);
    },
    undefined,
    4,
  );
  // #endregion
}

if ("window" in globalThis) {
  window.addEventListener("gamepadconnected", (e) => {
    console.log(e);
  });
}
