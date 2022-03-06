export type CommitMeta = Array<{
  date: string;
  author: string;
  hash: string;
  fullHash: string;
  message: string;
}>;

export type Post = {
  slug: string;
  title: string;
  description: string;
  content: string;
  commits: CommitMeta;
};

export type Posts = Array<Post>;
