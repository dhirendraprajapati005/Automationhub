export interface ThreadAuthor {
  _id: string;
  name: string;
  avatar?: string;
  reputationPoints: number;
}

export interface ThreadSummary {
  _id: string;
  type: "question" | "project";
  title: string;
  body: string;
  author: ThreadAuthor;
  images: string[];
  tags: string[];
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
}

export interface Comment {
  _id: string;
  author: ThreadAuthor;
  body: string;
  likedBy: string[];
  createdAt: string;
}

export interface ThreadDetail extends Omit<ThreadSummary, "likeCount"> {
  likedBy: string[];
}
