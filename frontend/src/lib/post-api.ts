import { api } from "@/lib/api";
import type { Post, PostSummary, PostType } from "@/types/post";

export const fetchPosts = async (type: PostType): Promise<PostSummary[]> => {
  const { data } = await api.get(`/posts/${type}`);
  return data.posts;
};

export const fetchPost = async (type: PostType, slug: string): Promise<Post> => {
  const { data } = await api.get(`/posts/${type}/${slug}`);
  return data.post;
};

// --- Admin ---
export const fetchAllPostsAdmin = async (type: PostType): Promise<Post[]> => {
  const { data } = await api.get(`/posts/${type}/admin/all`);
  return data.posts;
};

export const createPost = async (
  type: PostType,
  payload: { title: string; slug: string; excerpt: string; content: string; tags: string; isPublished: boolean }
): Promise<Post> => {
  const { data } = await api.post(`/posts/${type}`, payload);
  return data.post;
};

export const deletePost = async (type: PostType, id: string) => {
  await api.delete(`/posts/${type}/${id}`);
};
