"use client";

export function ChannelSection({
  id,
  content,
  date,
  isHTML,
}: {
  id: number;
  content: string;
  date: string;
  isHTML?: boolean;
}) {
  "use memo";
  const url = import.meta.env.VITE_CHANNELURL + "/" + id;
  return (
    <section id={id.toString()}>
      <p key={id} />
      {isHTML ? (
        <p
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
      ) : (
        <p>{content}</p>
      )}
      {/* 这里的 subtext 实际上是坏掉的，大家都坏掉了 */}
      {/* 我们需要等到 prose 能调整 layer 了再修 */}
      <p className="text-cat-subtext1! text-right">
        <small>
          {date}・
          <a href={url} target="_blank" rel="noreferrer">
            #{id}
          </a>
        </small>
      </p>
      {/* <hr /> */}
      {/* {index < total - 1 && <hr />} */}
    </section>
  );
}
