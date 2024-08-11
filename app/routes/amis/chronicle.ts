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
const EMOJI_REGEX = /\p{RGI_Emoji}/v;

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
];
