export default function SlowComponent() {
  // get today's date in MM-DD format
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayStr = `${month}-${day}`;

  // find tips that match today's date
  const matchedTips = tips.filter((tip) => tip.date === todayStr);

  // if no matched tips, pick a random one but no matched date
  let tipToShow;
  if (matchedTips.length > 0) {
    // pick a random tip from matched tips
    const randomIndex = Math.floor(Math.random() * matchedTips.length);
    tipToShow = matchedTips[randomIndex].data;
  } else {
    // filter out tips with dates
    const nonDateTips = tips.filter((tip) => !tip.date);
    const randomIndex = Math.floor(Math.random() * nonDateTips.length);
    tipToShow = nonDateTips[randomIndex].data;
  }

  return tipToShow;
}

export const getConfig = () => {
  return {
    render: "dynamic", // default is 'static'
  };
};

// 抽取逻辑
// 暂定：日期如果匹配，则只抽取当天的提示
// 日期也许需要农历的吧？但先不管
// 否则随机抽取一个提示
// 有没有 URL 对应的呢？好难猜啊

// TODO: 搞 O1 复杂度的索引，不要每次都遍历
const tips = [
  // 庆生
  {
    date: "05-05",
    data: (
      <p>
        5月5日是 <a href="/%E4%BA%BA/junyu33.md">Max</a> 的生日。生日快乐，Max！
      </p>
    ),
  },
  {
    date: "12-17",
    data: <p>12月17日是我的生日。祝大家都能找到自己的快乐！</p>,
  },
  {
    date: "12-22",
    data: (
      <p>
        12月22日是 <a href="/%E4%BA%BA/tzy.md">tzy</a> 的生日。生日快乐！
      </p>
    ),
  },
  // 隐私
  {
    data: <p>我喜欢翻看网站后台，能认出这里的常客哟。</p>,
  },
  {
    data: (
      <p>
        网站的文章由我创作，经几位朋友审阅并补充，不含任何 AI 创作或虚构成分。
      </p>
    ),
  },
  {
    data: (
      <p>
        我不喜欢陌生的机器人阅读我的文章。
        <a href="https://utcc.utoronto.ca/~cks/cspace-old-browser.html">
          机器人常伪装成旧款浏览器
        </a>
        ，我一律拦截。
      </p>
    ),
  },
  {
    data: (
      <p>
        有朋友不希望我把他们的传记或者叫合订本公开，于是我把有关文章藏在了防火墙之后。
      </p>
    ),
  },
  // 个人习惯
  {
    data: (
      <p>
        你知道吗？写程序的朋友之中，我和海豚是会用 Linux 但主动选择用 Windows
        的唯二的人。
      </p>
    ),
  },
  // 网站设计
  {
    data: (
      <p>
        你知道吗？你会在这里读到和某篇文章相关的随机提示。如果感兴趣，请去读读全文！
      </p>
    ),
  },
  {
    data: (
      <p>
        网站的粉彩色调出自<a href="https://catppuccin.com/">猫布奇诺</a>
        （Catppuccin）。即使不擅长配色，也能用它设计出佳作！
      </p>
    ),
  },
  {
    data: (
      <p>
        本站是最新网页技术的试验田，只兼容2026年之后最新的浏览器。要求的最新 API
        是{" "}
        <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Navigation_API">
          Navigation API
        </a>
        ，大致对应{" "}
        <a href="https://chromestatus.com/feature/5134734612496384">
          Chrome 141
        </a>{" "}
        和 Firefox 147。
      </p>
    ),
  },
  {
    data: (
      <p>
        发表在本站的练笔不外乎
        <strong className="text-cat-yellow">写人</strong>、
        <strong className="text-cat-sapphire">叙事</strong>、
        <strong className="text-cat-pink">状物</strong>、
        <strong className="text-cat-green">抒情</strong>
        四类。实用文我会投稿给别处发表。
      </p>
    ),
  },
];
