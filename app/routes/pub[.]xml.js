import rss from "@astrojs/rss";

/** @satisfies {import("@remix-run/cloudflare").LoaderFunction} */
export const loader = async () => {
  // const data = await (
  //   await fetch("https://api.github.com/users/Master-Hash/gists")
  // ).json();

  return rss({
    title: "Hash's Publications",
    site: import.meta.env.VITE_SITEURL,
    description:
      "我发表过的所有文章。不是笔记，而是个人的想法和发现。我期待有作品在期刊发表，在 Hacker News 上讨论的一天。",
    // items: data.map((item) => {
    //   const titles = Object.keys(item.files);
    //   const title = titles[0].split(".")[0];

    //   return {
    //     link: item.html_url,
    //     pubDate: new Date(item.created_at),
    //     title,
    //     description: item.description,
    //   };
    // }),
    items: [
      {
        link: "https://blog.junyu33.me/2023/11/28/beijing",
        title: "从北京城市建设看新中国的城市建设及时代背景",
        pubDate: new Date("2023-11-28"),
      },
      {
        link: "https://blog.junyu33.me/2021/12/19/%E3%80%8A%E8%8C%B8%E9%9B%AA%E3%80%8B%E8%AE%B2%E7%A8%BF",
        title: "《茸雪》讲稿：反乌托邦的爱情，存在主义的自由、反抗",
        pubDate: new Date("2021-12-18"),
      },
    ],

    // [
    //   {
    //     link: "https://baidu.com/hhh",
    //     pubDate: new Date("2021-09-09"),
    //     title: "title",
    //   },
    // ],
    stylesheet: "/rss.xsl",
    xmlns: { h: "http://www.w3.org/TR/html4/" },
    trailingSlash: false,
  });
};

// const a = await getRssString({
//   title: "hello",
//   site: import.meta.env.SITEURL,
//   description: "",
//   items: [],
// });

// if (argv[1] === fileURLToPath(import.meta.url)) {
//   console.log(
//     new XMLBuilder({
//       cdataPropName: [""]
//     }).build({
//       "?xml": "",
//       feed: {
//         id: "https://land.master-hash.workers.dev/",
//         title: "Hashland",
//         updated: "2024-01-25T07:33:07.767Z",
//         generator: "https://github.com/jpmonette/feed",
//         subtitle: "文章合集",
//         icon: "https://land.master-hash.workers.dev/favicon.svg",
//         rights: "公共领域",
//         entry: {
//           title: "打乱列表算法",
//           id: "https://land.master-hash.workers.dev/post/shuffle-array",
//           link: "",
//           updated: "2022-03-12T16:18:09.000Z",
//           summary:
//             "打乱列表可以用抓阄和洗牌算法实现；随机排序可以打乱，但不均匀，本文探讨了此现象的成因。",
//           content:
//             "<h1>打乱列表算法</h1>\n" +
//             "    <p>打乱列表可以用抓阄和洗牌算法实现；随机排序可以打乱，但不均匀，本文探讨了此现象的成因。</p>\n" +
//             "    <h2>分析</h2>\n" +
//             "    <p>乱序列表有以下两个特征：</p>\n" +
//             "    <ul>\n" +
//             "    <li>原列表每种全排列等可能出现</li>\n" +
//             "    <li>新列表每一项等可能出现原列表任一项</li>\n" +
//             "    </ul>\n" +
//             "    <p>后者可以方便地实现。</p>\n" +
//             "    <h2>抓阄算法</h2>\n" +
//             "    <p>名字是我自己起的，因为保证“新列表每一项等可能出现原列表任一项”的原理和抓阄公平的原理完全相同。</p>\n" +
//             "    <p>即：随机取走原列表一项，放入新列表末端，直到原列表为空。</p>\n" +
//             "    <h2>优化：洗牌算法（Fisher-Yates shuffle）</h2>\n" +
//             "    <p>逆向遍历数组，并将每个元素与其前面的随机的一个元素互换位置。这样每次循环，末尾就会固定下来一个随机数。</p>\n" +
//             "    <p>lodash 和 Python 的 <code>random.shuffle()</code> 均采用此算法。</p>\n" +
//             "    <p>可以从“参见”中找到 JavaScript 示例代码。</p>\n" +
//             "    <h2>错误算法：<code>array.sort(() => Math.random() - 0.5)</code></h2>\n" +
//             "    <p><code>Math.random() - 0.5</code> 正负随机，因此排序函数会随机地对数组中的元素进行重新排序。</p>\n" +
//             "    <p>我从信息组得知，C++ 这么写，会 Runtime Error，因为随机数很可能不满足传递性。</p>\n" +
//             "    <p>JavaScript 里，这样能跑起来，但并非所有的排列都具有相同的概率。这是为什么？</p>\n" +
//             "    <p>我的观点如下：每次比较回调时，结果都会二分，因此无论是什么排序算法，共比较多少次，结果情况总数一定是 2\n" +
//             "    的整数次幂；但相同情况数为全排列数，等于列表长度阶乘，长度 ≥3 时，不可能整除情况总数，因此不可能平分。</p>\n" +
//             "    <p><strong>正确算法和错误算法的差异在于，前者关注“和谁交换”，后者关注“是否交换”。</strong></p>\n" +
//             "    <h2>驳论：两两比较即可纯乱序？</h2>\n" +
//             "    <p>观点来自\n" +
//             '    <a href="https://blog.csdn.net/wulove52/article/details/85804728">javascript随机打乱数组shuffle_黑夜人的博客-CSDN博客_javascript shuffle</a></p>\n' +
//             "    <blockquote>\n" +
//             "    <p>其实我们使用 array.sort 进行乱序，理想的方案或者说纯乱序的方案是：数组中每两个元素都要进行比较，这个比较有 50%\n" +
//             "    的交换位置概率。如此一来，总共比较次数一定为 n(n-1)。<br>\n" +
//             "    ————————————————<br>\n" +
//             "    版权声明：本文为CSDN博主「wulove52」的原创文章，遵循CC 4.0 BY-SA版权协议。</p>\n" +
//             "    </blockquote>\n" +
//             "    <p>根据上文，两两比较依然不是乱序。</p>\n" +
//             "    <h2>参见</h2>\n" +
//             "    <ul>\n" +
//             '    <li><a href="https://zh.javascript.info/array-methods#sui-ji-pai-lie-shu-zu">JAVASCRIPT.INFO</a></li>\n' +
//             "    </ul>\n" +
//             "    <h2>花絮</h2>\n" +
//             "    <p>有一则古老的故事，讲两个演员互不相让，都想排在名单的第一位。老板把两人的名字贴在走马灯上，名字随走马灯转动，轮流出 现在大厅的正面，这样两人都服气了。</p>\n" +
//             "    <p>这也是我坚持“友链顺序随机”的原因。</p>\n" +
//             "    <p>但在 JavaScript 中实现时，我发现 JavaScript 竟然没有自带乱序函数。</p>\n" +
//             "    <p>JAVASCRIPT.INFO 提供了两种算法。因为第一种代码量较少，并且可以写成伪纯函数（JavaScript\n" +
//             "    并没有封装随机副作用），我先采用了第一种错误算法。</p>\n" +
//             "    <p>后来在三月 7、8 号二诊模拟期间，我（摸鱼）研究了这两种算法，也就有了本文。</p>\n" +
//             "    <p>我还具体研究了很多排序算法的效果，手画了很多树状图来定量计算小列表的概率，不过我觉得没必要，就没写出来。</p>",
//           author: { name: "Master-Hash" },
//           published: "2022-03-12T16:18:09.000Z",
//         },
//       },
//     }),

//     // new XMLParser().parse(`<?xml version="1.0" encoding="utf-8"?>
//     // <feed xmlns="http://www.w3.org/2005/Atom">
//     //     <id>https://land.master-hash.workers.dev/</id>
//     //     <title>Hashland</title>
//     //     <updated>2024-01-25T07:33:07.767Z</updated>
//     //     <generator>https://github.com/jpmonette/feed</generator>
//     //     <subtitle>文章合集</subtitle>
//     //     <icon>https://land.master-hash.workers.dev/favicon.svg</icon>
//     //     <rights>公共领域</rights>
//     //     <entry>
//     //         <title type="html"><![CDATA[打乱列表算法]]></title>
//     //         <id>https://land.master-hash.workers.dev/post/shuffle-array</id>
//     //         <link href="https://land.master-hash.workers.dev/post/shuffle-array"/>
//     //         <updated>2022-03-12T16:18:09.000Z</updated>
//     //         <summary type="html"><![CDATA[打乱列表可以用抓阄和洗牌算法实现；随机排序可以打乱，但不均匀，本文探讨了此现象的成因。]]></summary>
//     //         <content type="html"><![CDATA[<h1>打乱列表算法</h1>
//     // <p>打乱列表可以用抓阄和洗牌算法实现；随机排序可以打乱，但不均匀，本文探讨了此现象的成因。</p>
//     // <h2>分析</h2>
//     // <p>乱序列表有以下两个特征：</p>
//     // <ul>
//     // <li>原列表每种全排列等可能出现</li>
//     // <li>新列表每一项等可能出现原列表任一项</li>
//     // </ul>
//     // <p>后者可以方便地实现。</p>
//     // <h2>抓阄算法</h2>
//     // <p>名字是我自己起的，因为保证“新列表每一项等可能出现原列表任一项”的原理和抓阄公平的原理完全相同。</p>
//     // <p>即：随机取走原列表一项，放入新列表末端，直到原列表为空。</p>
//     // <h2>优化：洗牌算法（Fisher-Yates shuffle）</h2>
//     // <p>逆向遍历数组，并将每个元素与其前面的随机的一个元素互换位置。这样每次循环，末尾就会固定下来一个随机数。</p>
//     // <p>lodash 和 Python 的 <code>random.shuffle()</code> 均采用此算法。</p>
//     // <p>可以从“参见”中找到 JavaScript 示例代码。</p>
//     // <h2>错误算法：<code>array.sort(() => Math.random() - 0.5)</code></h2>
//     // <p><code>Math.random() - 0.5</code> 正负随机，因此排序函数会随机地对数组中的元素进行重新排序。</p>
//     // <p>我从信息组得知，C++ 这么写，会 Runtime Error，因为随机数很可能不满足传递性。</p>
//     // <p>JavaScript 里，这样能跑起来，但并非所有的排列都具有相同的概率。这是为什么？</p>
//     // <p>我的观点如下：每次比较回调时，结果都会二分，因此无论是什么排序算法，共比较多少次，结果情况总数一定是 2
//     // 的整数次幂；但相同情况数为全排列数，等于列表长度阶乘，长度 ≥3 时，不可能整除情况总数，因此不可能平分。</p>
//     // <p><strong>正确算法和错误算法的差异在于，前者关注“和谁交换”，后者关注“是否交换”。</strong></p>
//     // <h2>驳论：两两比较即可纯乱序？</h2>
//     // <p>观点来自
//     // <a href="https://blog.csdn.net/wulove52/article/details/85804728">javascript随机打乱数组shuffle_黑夜人的博客-CSDN博客_javascript shuffle</a></p>
//     // <blockquote>
//     // <p>其实我们使用 array.sort 进行乱序，理想的方案或者说纯乱序的方案是：数组中每两个元素都要进行比较，这个比较有 50%
//     // 的交换位置概率。如此一来，总共比较次数一定为 n(n-1)。<br>
//     // ————————————————<br>
//     // 版权声明：本文为CSDN博主「wulove52」的原创文章，遵循CC 4.0 BY-SA版权协议。</p>
//     // </blockquote>
//     // <p>根据上文，两两比较依然不是乱序。</p>
//     // <h2>参见</h2>
//     // <ul>
//     // <li><a href="https://zh.javascript.info/array-methods#sui-ji-pai-lie-shu-zu">JAVASCRIPT.INFO</a></li>
//     // </ul>
//     // <h2>花絮</h2>
//     // <p>有一则古老的故事，讲两个演员互不相让，都想排在名单的第一位。老板把两人的名字贴在走马灯上，名字随走马灯转动，轮流出现在大厅的正面，这样两人都服气了。</p>
//     // <p>这也是我坚持“友链顺序随机”的原因。</p>
//     // <p>但在 JavaScript 中实现时，我发现 JavaScript 竟然没有自带乱序函数。</p>
//     // <p>JAVASCRIPT.INFO 提供了两种算法。因为第一种代码量较少，并且可以写成伪纯函数（JavaScript
//     // 并没有封装随机副作用），我先采用了第一种错误算法。</p>
//     // <p>后来在三月 7、8 号二诊模拟期间，我（摸鱼）研究了这两种算法，也就有了本文。</p>
//     // <p>我还具体研究了很多排序算法的效果，手画了很多树状图来定量计算小列表的概率，不过我觉得没必要，就没写出来。</p>]]></content>
//     //         <author>
//     //             <name>Master-Hash</name>
//     //         </author>
//     //         <published>2022-03-12T16:18:09.000Z</published>
//     //     </entry>
//     // </feed>`),
//   );
// }
