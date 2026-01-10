// import chars from "@iconify-json/fluent-emoji-high-contrast/chars.json" with { type: "json" };
import { Assets } from "pixi.js";
import chars from "virtual:partial-chars";

import { EMOJI_REGEX } from "../../utils/constant.ts";
import chronicles from "./chronicles.json" with { type: "json" };

export async function loadTexture(noto: boolean = true) {
  console.log(chars);
  if (Assets.resolver.resolve("zodiac").src !== "/zodiac-white.png") {
    Assets.add({
      src: noto ? "/zodiac-noto.png" : "/zodiac-white.png",
      alias: "zodiac",
    });
    chronicles.forEach((chronicle) => {
      if (chronicle.emoji.match(EMOJI_REGEX)) {
        const codePoint = [...chronicle.emoji]
          .map((char) => char.codePointAt(0)?.toString(16))
          .join("-");
        console.log(codePoint);
        const codePointDecimal = chronicle.emoji.codePointAt(0);
        Assets.add({
          src: noto
            ? `/Noto_Emoji/${codePointDecimal}.png`
            : `/fluent-emoji-high-contrast/fluent-emoji-high-contrast_${chars[codePoint]}.png`,
          alias: chronicle.emoji,
        });
      } else {
        const [iconSet, iconName] = chronicle.emoji.split(":");
        Assets.add({
          src: "/" + iconSet + "/" + iconSet + "_" + iconName + ".png",
          alias: chronicle.emoji,
        });
      }
    });
  }
  return await Assets.load([
    "zodiac",
    ...chronicles.map((chronicle) => chronicle.emoji),
  ]);
}

export async function unloadTexture() {
  await Assets.unload([
    "zodiac",
    ...chronicles.map((chronicle) => chronicle.emoji),
  ]);
}
