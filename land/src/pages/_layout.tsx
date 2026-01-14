import type { ReactElement } from "react";

import { Slice } from "waku";
import { unstable_getContext } from "waku/server";

import {
  FooterComponent,
  HashError,
  HeaderComponent,
} from "../components/root.tsx";

export default function LayoutWithTips({
  children,
}: {
  children: ReactElement;
}) {
  const { req } = unstable_getContext();
  return (
    <>
      <HeaderComponent />
      <HashError>{children}</HashError>
      <footer className="relative mx-auto w-[calc(100%-3rem)] max-w-[38ic] p-3 pt-12 text-cat-subtext1 print:hidden">
        <div>
          <small>
            <Slice id="tip" lazy fallback={"抽取提示中……"} />
          </small>
        </div>
        <FooterComponent />
      </footer>
    </>
  );
}

export const getConfig = () => {
  return {
    render: "static",
  } as const;
};
