import { useLoaderData } from "remix";
import type { LoaderFunction, MetaFunction, } from "remix";

/**
 * @see https://javascript.info/array-methods#shuffle-an-array
 */
function shuffle<T>(xs: Array<T>): Array<T> {
  const array = [...xs];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const loader: LoaderFunction = () =>
  shuffle(friends);

export const meta: MetaFunction = () => {
  return {
    title: "友链 « Hashland",
    "og:title": "友链 « Hashland",
    "og:description": "Hash 的挚友和邻居（暂无家属，悲",
    description: "Hash 的挚友和邻居（暂无家属，悲",
  };
};

type Friends = {
  name: string;
  url: string;
  image: string;
}[];

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

export default function FriendsComponent() {
  const _friends = useLoaderData<Friends>();
  return (
    <>
      <h1 className="my-18 font-bold text-4xl text-center">友链</h1>
      <ul className="my-8 flex flex-wrap justify-center space-x-12">
        {_friends
          /**
           * 数组乱序错误方式
           * @see https://javascript.info/array-methods#shuffle-an-array
           * 还会导致图片错位……
           */
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