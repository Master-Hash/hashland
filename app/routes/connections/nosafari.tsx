"use client";

import { isSafari } from "pixi.js";

export function NoSafari() {
  const _isSafari = isSafari();
  if (_isSafari) {
    return (
      <p suppressHydrationWarning>
        本游戏所用物理引擎无法在 Safari 上正确运行。
      </p>
    );
  } else {
    return null;
  }
}
