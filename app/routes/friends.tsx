const friends = [
  {
    name: "Xecades",
    url: "https://xecades.xyz/",
    // image: "https://gravatar.loli.net/avatar/64753df00cda97caea9ad8f02ad3d609",
    image: "/images/xecades.png",
  },
  {
    name: "junyu33",
    url: "https://junyu33.github.io/",
    image: "/images/mp.jpg",
    // image: "/images/junyu33",
  },
  {
    name: "?sjfh",
    url: "https://sjfhsjfh.gitee.io/",
    image: "/images/mp.jpg",
    // image: "/images/sjfhsjfh",
  },
];

export default function Friends() {
  return (
    <>
      <h1 className="my-18 font-bold text-4xl text-center">友链</h1>
      <div className="mx-auto my-8 text-xs max-w-xs translate-x-8">
        <p>已知错误：刷新会导致头像、名称、链接错位</p>
        <p>缓解方案：请勿主动刷新；<br />先路由至其它页面，再回到本页，可恢复正常；<br />正常状态下，点击导航栏上本页路由可随机排序。
        </p>
      </div>
      <ul className="my-8 flex flex-wrap justify-center space-x-12">
        {friends
          /**
           * 数组乱序错误方式
           * @see https://javascript.info/array-methods#shuffle-an-array
           * 还会导致图片错位……
           */
          .sort(() => Math.random() - 0.5)
          .map(friend =>
            <li key={friend.url}>
              <a href={friend.url} target="_blank" rel="noreferrer">
                <figure className="hover:opacity-80">
                  <img src={friend.image} alt="Avatar" className="h-16 w-16 rounded-full" />
                  <figcaption className="text-center">{friend.name}</figcaption>
                </figure>
              </a>
            </li>
          )
        }
      </ul>
    </>
  );
}