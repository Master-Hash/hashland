import { chars } from "@iconify-json/fluent-emoji-high-contrast";
import { Assets } from "pixi.js";
import chronicles from "./chronicle.js";

export async function loadTexture() {
  if (Assets.resolver.resolve("zodiac").src !== "/zodiac-white.png") {
    Assets.add({
      src: "/zodiac-white.png",
      alias: "zodiac",
    });
    chronicles.forEach((chronicle) => {
      if (chronicle.emoji.match(/[\p{RGI_Emoji}\u26f0]/v)) {
        const codePoint = [...chronicle.emoji]
          .map((char) => char.codePointAt(0)?.toString(16))
          .join("-");
        // console.log(codePoint);
        const emojiName = chars[codePoint];
        Assets.add({
          src:
            "/fluent-emoji-high-contrast/fluent-emoji-high-contrast_" +
            emojiName +
            ".png",
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
