if (typeof globalThis.Temporal === "undefined") {
  globalThis.Temporal = (await import("@js-temporal/polyfill")).Temporal;
}

/**
 * @todo 如果以后图片多了，就把 betterMarkdown() 写出来
 *       否则挨着改导入的 Markdown 太太麻烦了
 */

export const fetchRejectedOnNotOk = (async (input, init?) => {
  const a = await fetch(input, init);
  console.log(a.status);
  if (a.ok) return a;
  else throw new Error();
}) satisfies typeof fetch;

export function isSafari(): boolean {
  const ua = navigator.userAgent;
  return /^((?!chrome|android).)*safari/i.test(ua);
}

export const ShanghaiNowDateTime = () =>
  globalThis.Temporal.Now.zonedDateTimeISO("Asia/Shanghai");
