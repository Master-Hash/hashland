/// <reference types="@react-router/cloudflare" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITEURL: string;
  readonly VITE_ASSETSURL: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.md" {
  const MDXComponent: (props: any) => JSX.Element;
  export const frontmatter: any;
  export default MDXComponent;
}

declare module "*.mdx" {
  const MDXComponent: (props: any) => JSX.Element;
  export const frontmatter: any;
  export default MDXComponent;
}
