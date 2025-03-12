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
