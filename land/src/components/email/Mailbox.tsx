import { Link } from "waku";

export type Message = {
  // 不一定显示，但是万一之后想显示了呢？
  // 我目前倾向于不写，除了为省空间狡辩，还有个理由：我看 Hacker News 就不咋看回复时间，这又不是 Github Issue
  datetime: string;
  // 哎，可能包括姓名也可能不包括
  address: string;
  subject?: string;
  // 也可能是 Message-ID，但是不必小心，反正不用来显示
  hash: string;
  recipientLength?: number;
  /**
   * @deprecated
   */
  isMultipleRecipient?: boolean;
};

// 未来我希望是服务端组件
// 这样格式转换就能留在组件内
// 方便调试
export function Mailbox({ messages }: { messages: Message[] }) {
  return (
    <table className="cat-latte dark:cat-frappe prose text-cat-text prose-headings:text-cat-text">
      <thead>
        {messages[0].subject === undefined ? (
          <tr>
            <th className="text-center">时间戳</th>
            <th
              // className="relative right-[0.1rem]"
              className="text-center"
            >
              地址
            </th>
          </tr>
        ) : (
          <tr>
            <th className="text-center">主题</th>
            {/* min-w-60 */}
            <th className="text-center">讨论者</th>
            {/* <th className="text-center">日期</th> */}
          </tr>
        )}
      </thead>
      <tbody className="font-mono">
        {messages.map((message) => {
          // 分为若干情况：
          // 1. 显示时间戳和一位发件人
          // 2. 显示时间戳和多位发件人
          // 3. 显示主题和不知道多少发件人
          // 倒计时将不计入表，另用文本提示。
          const isContainName = message.address.match(
            /(.+)\s<((?:[\w_-]+(?:\.[\w_-]+)*)@(?:(?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,18}))>/,
          );
          return (
            <tr key={message.hash}>
              {message.subject === undefined ? (
                <td className="text-center">{message.datetime}</td>
              ) : (
                <td className="text-center">
                  {/**
                   * @todo 类型安全的 Link？
                   */}
                  <Link className="not-prose" to={"/mailbox/" + message.hash}>
                    {message.subject}
                  </Link>
                </td>
              )}
              <td className="text-center">
                {isContainName !== null ? (
                  <a className="not-prose" href={`mailto:${isContainName[2]}`}>
                    {isContainName[1]}
                  </a>
                ) : (
                  <span className="text-center">
                    {message.recipientLength !== undefined &&
                    message.recipientLength >= 2
                      ? message.address.replace("~~", "")
                      : message.address}
                  </span>
                )}
                {message.recipientLength !== undefined &&
                message.recipientLength >= 2 ? (
                  //  || Math.random() < 0.5
                  <span title="此邮件有多位收件人，仅显示第一位。" className="">
                    {message.recipientLength >= 11
                      ? ",+*"
                      : `,+${message.recipientLength - 1}`}
                  </span>
                ) : (
                  <span className="hidden">,+0</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
