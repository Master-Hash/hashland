"use client";

import "../components/sticky.css";

export default function Sticky() {
  return (
    <main className="relative mx-auto prose">
      <title>便利贴视觉设计 « 故人故事故纸堆</title>
      <meta property="og:title" content="便利贴视觉设计 « 故人故事故纸堆" />
      <h1>便利贴视觉设计</h1>
      <p>作者：Claude Sonnet 4.6，以及不懈 debug 的我。</p>
      {/* <p>优点：配色好看，阴影关系、倾斜关系自然</p>
      <p>
        缺点：没有暗色主题版，不适合 Catppuccin 主题色，不适合用在 details 场景
      </p> */}
      <div className="board">
        <details className="note yellow" open>
          <summary>短内容</summary>
          <p>
            牛奶
            <br />
            鸡蛋 × 6<br />
            面包 × 1
          </p>
        </details>

        <details className="note pink" open>
          <summary>中等内容</summary>
          <p>下午 3 点开会，记得带电脑。</p>
          <p>找 Alice 确认 Q2 数据，周五前发给老板。</p>
          <p>顺便问一下报销进度。</p>
        </details>

        <details className="note mint" open>
          <summary>长内容</summary>
          <p>
            这是一张正文非常长的便利贴，用来验证当内容超过固定高度时，便利贴能否自然撑开而不截断文字。
          </p>
          <p>关键在于不设 height，让 details 元素由内容决定高度。</p>
          <p>
            ::before 的底层纸张使用 height:
            100%，会在父元素尺寸确定后再渲染，因此始终能完整覆盖。
          </p>
          <p>
            <del>
              ::after 的翻角使用 position: absolute; bottom: 0; right:
              0，锚定在右下角，无论内容多长都不会漂移。
            </del>
          </p>
          <p>我不喜欢折角，干掉了</p>
        </details>

        <details className="note blue">
          <summary>折叠状态</summary>
          <p>点击展开后，便利贴高度会撑开，双层底纸和翻角依然正确跟随。</p>
          <p>这里可以放很长很长很长很长很长很长很长很长的内容，完全没问题。</p>
        </details>
      </div>
    </main>
  );
}
