export type PostType = "blog" | "news";

export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  authorName: string;
  tags: string[];
  publishedAt: string;
}

export interface Post extends PostSummary {
  _id: string;
  type: PostType;
  content: string;
  isPublished?: boolean;
}
