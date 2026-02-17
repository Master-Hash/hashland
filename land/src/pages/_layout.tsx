import type { ReactElement } from "react";

export default function LayoutWithTips({
  children,
}: {
  children: ReactElement;
}) {
  return children;
}

export const getConfig = () => {
  return {
    render: "static",
  } as const;
};
