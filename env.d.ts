/// <reference types="@remix-run/cloudflare" />
/// <reference types="vite/client" />

// import type { KVNamespace } from "@cloudflare/workers-types";

interface ImportMetaEnv {
  readonly VITE_SITEURL: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// declare module "@remix-run/cloudflare" {
interface AppLoadContext {
  env: {
    // MY_KV: KVNamespace;
  };
}
// }

declare module "*.mdx" {
  const MDXComponent: (props: any) => JSX.Element;
  export const frontmatter: any;
  export default MDXComponent;
}
