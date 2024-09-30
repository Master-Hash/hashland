type Message = {
  datetime: string;
  address: string;
  hash: string;
  isMultipleRecipient: boolean;
};

// 未来我希望是服务端组件
// 这样格式转换就能留在组件内
// 方便调试
export function Mailbox({ messages }: { messages: Message[] }) {
  return (
    <table className="cat-latte prose bg-cat-base text-cat-text dark:cat-frappe prose-headings:text-cat-text">
      <thead>
        <tr>
          <th className="text-center">时间戳</th>
          <th
            // className="relative right-[0.1rem]"
            className="text-center"
          >
            地址
          </th>
        </tr>
      </thead>
      <tbody className="font-mono">
        {messages.map((message) => {
          return (
            <tr key={message.hash}>
              <td className="text-center">{message.datetime}</td>
              <td className="flex items-center justify-center">
                <span className="">{message.address}</span>
                {message.isMultipleRecipient ? (
                  <span
                    title="此邮件有多位收件人，仅显示第一位。"
                    className="icon-[fluent--people-28-filled] relative left-2 size-[1.1rem]"
                  />
                ) : (
                  <span className="icon-[fluent--people-28-filled] invisible relative left-2 size-[1.1rem]" />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
