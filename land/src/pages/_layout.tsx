import { Layout } from "../components/root.tsx";

export default Layout;

export const getConfig = () => {
  return {
    render: "static",
  } as const;
};
