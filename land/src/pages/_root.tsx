import { Root } from "../components/root.tsx";

export default Root;

export const getConfig = () => {
  return {
    render: "static",
  } as const;
};
