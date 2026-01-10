import type { Application, Container, Texture } from "pixi.js";

import type {
  Collider,
  ImpulseJoint,
  RigidBody,
  World,
} from "./rapier2d/rapier.d.ts";

export type Context = {
  app: Application;
  world: World;
  texture: Record<string, Texture>;
  isDark: boolean;
};

// 考虑所有坐标都继承了 Container 类，我们不需要手动代理
/**
 * 这个字段实际上是 Text, Sprite, Graphics, 等等等的实例
 */
export interface PixiConteneur {
  conteneur: Container;
}

export interface PixiTexture extends PixiConteneur {
  texture: Texture;
}

// 至于这刚体是不是碰撞体，这个就交给物理引擎处理就好了
// Zodiac 是刚体而不是碰撞体
export interface RapierRigid extends PixiConteneur {
  rigid: RigidBody;
}

export interface DragTag extends RapierRigid {
  // 我也不知道为什么没起名 isDragged
  dragTag: boolean;
  joint: ImpulseJoint | null;
}

// Chronicle 的碰撞体附加在 Zodiac 上
export interface RapierCollider extends PixiConteneur {
  collider: Collider;
}

// export interface KinematicBody extends RapierRigid {
//   // 由 zodiac 继承（啊希望能 lens 自动提示）
//   // chronicle 的……就不继承了，我用脑子记
//   // 我们私自维护角速度，包括阻力
//   // 但是传给引擎的是每刻钟的实际位置

//   // 至于为什么不能从拖拽点推算？
//   // 因为拖拽结束后，还有惯性！
//   angularVelocity: number;
// }

// 就不给“事件”都打上 tag 了qaq
export interface Attracted extends RapierRigid {
  attractedBy: Array<ChronicleGroup>;
}

// 我们整体计算 Chronicle 组的坐标
// 但实际碰撞箱是 Chronicle 本身的
/**
 * @param {number} theta 右手系坐标，逆时针为正
 */
export class ChronicleGroup implements PixiConteneur, RapierCollider {
  constructor(
    public readonly conteneur: Container,
    public readonly collider: Collider,
    public readonly title: string,
    public readonly people: Array<string>,
    public readonly r: number,
    public readonly theta: number,
  ) {}
}

// 同理
export class BubbleGroup
  implements PixiConteneur, RapierRigid, DragTag, Attracted
{
  constructor(
    public readonly conteneur: Container,
    public readonly rigid: RigidBody,
    public readonly name: string,
    public attractedBy: Array<ChronicleGroup> = [],
    public joint: ImpulseJoint | null = null,
    public dragTag: boolean = false,
  ) {}
}

export class Zodiac implements PixiConteneur, RapierRigid, DragTag {
  constructor(
    public readonly conteneur: Container,
    public readonly rigid: RigidBody,
    public joint: ImpulseJoint | null = null,
    public r: number = 0,
    public dragTag: boolean = false,
  ) {}
}

// 明日 todo
// 先写 data class
// 系统每帧要做的事情
// 拖拽
// - 改变了位置，速度/角速度
// - 新的位置的依据是 Δ
// - 速度/角速度的依据也是 Δ
// - 所以把上一帧的全局拖拽坐标存起来很有必要？
// 吸引（仅限没有被拖的）
// - 说实话，我们现在已经有了综合多个吸引力的能力
// 按照当前速度/角速度发展（仅限没有被拖的）
// 碰撞的弹开
// 把物理世界的结果反馈到 Pixi 对象（必须全体从物理引擎取得，否则不一致！）

/**
 * 如果是 ECS 系统，拖拽 API 是什么样子呢？
 * 遍历能拖拽的对象
 * 然后加上组件
 * 差不多就是这样……
 * 所以：我们统一格式，用统一的函数记录，数据不改变任何物理状态
 * 数据留给后面的系统处理
 * 就当这是第一个系统了
 *
 * 另外，物理系统会怎么看待拖拽造成的瞬移呢？
 * 高中物理的基本常识是：加速度可以突变，速度不能突变
 */

/**
 * 我现在把静态渲染搞完了……
 * 想想接下来该干嘛
 * 1. 能拖拽黄道
 * 2. 能据此算出黄道和事件的位置，并修改
 */
