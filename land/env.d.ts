/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITEURL: string;
  readonly VITE_ASSETSURL: string;
  readonly VITE_CHANNELURL: string;
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

declare module "virtual:partial-chars" {
  const chars: Record<string, string>;
  export default chars;
}

declare module "virtual:light" {
  const light: Record<string, number>;
  export default light;
}

declare module "virtual:dark" {
  const dark: Record<string, number>;
  export default dark;
}
