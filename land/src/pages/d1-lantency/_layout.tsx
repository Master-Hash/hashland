"use client";
import { Fragment, type ReactNode } from "react";
import { Link, useRouter } from "waku";

const allTests = [1, 2, 3, 4, 5];

export default function D1Layout({ children }: { children: ReactNode }) {
  const { path } = useRouter();
  return (
    <main className="relative mx-auto prose prose-a:whitespace-nowrap">
      {children}
      <p>娱乐测试，仅供参考。</p>
      <p>
        {allTests
          // .filter((t) => t.toString() !== params.testid)
          .map((serial, index) => {
            return (
              <Fragment key={serial}>
                {!path.endsWith(`${serial}`) ? (
                  <Link to={`/d1-lantency/${serial}`}>测试{serial}</Link>
                ) : (
                  `测试${serial}`
                )}

                {index !== allTests.length - 1 ? "・" : null}
              </Fragment>
            );
          })}
      </p>
    </main>
  );
}
