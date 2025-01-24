// 所有数据从 post-test 中提取
// 包含：
// 1. 标题
// 2. 时间
// 3. emoji
// 4. 和哪些人有关
// 5. （可选）和哪些纪念品，日常用品，，地点，情感有关
// 6. （可选）是否重要，是否属于连载

// 这里是 mock 数据

// to test if a string is emoji

// important series 现在压根没程序用到
// 如果真的要表示 series 我宁可直接给个时间数组的数组，直接连线

export const chronicles = [
  {
    title: "初次日常裙装",
    date: "2024-04-17",
    emoji: "👗",
    people: [],
  },
  {
    title: "旁听科学仪器史",
    date: "2024-03-27",
    emoji: "game-icons:astrolabe",
    series: true,
    people: ["Spheniscidae"],
  },
  {
    title: "初见阿鱼",
    date: "2024-06-29",
    emoji: "🎹",
    important: true,
    people: ["Ayu"],
  },
  {
    title: "修订网站",
    date: "2024-07-08",
    emoji: "🚧",
    important: true,
    series: true,
    people: ["Ayu"],
  },
  {
    title: "玩图灵完备",
    date: "2024-10-09",
    emoji: "fluent:brain-circuit-24-regular",
    people: [],
  },
  {
    title: "初识哲涵",
    date: "2024-10-20",
    emoji: "👻",
    people: ["Spheniscidae", "哲涵"],
  },
  {
    title: "学 CSAPP",
    date: "2024-11-9",
    emoji: "fluent:memory-16-regular",
    people: ["Kevin Liu"],
  },
  {
    title: "第二份前端工作",
    date: "2024-11-27",
    emoji: "\u26f0", // 山
    people: ["哲涵", "续本达"],
  },
  {
    title: "Connected through Gravity",
    date: "2024-12-05",
    emoji: "game-icons:mesh-network",
    people: ["哲涵", "续本达"],
  },
  {
    title: "争吵",
    date: "2024-12-20",
    emoji: "💔",
    people: ["Spheniscidae"],
  },
  {
    title: "解析技术",
    date: "2025-01-12",
    emoji: "tabler:binary-tree",
    people: [],
  },
];
