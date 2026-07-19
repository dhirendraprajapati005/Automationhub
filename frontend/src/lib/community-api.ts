import { api } from "@/lib/api";
import type { ThreadSummary, ThreadDetail, Comment } from "@/types/community";

export const fetchThreads = async (params?: { type?: string; tag?: string; sort?: string }) => {
  const { data } = await api.get("/community/threads", { params });
  return data.threads as ThreadSummary[];
};

export const fetchThread = async (id: string) => {
  const { data } = await api.get(`/community/threads/${id}`);
  return data as { thread: ThreadDetail; comments: Comment[] };
};

export const createThread = async (formData: FormData) => {
  const { data } = await api.post("/community/threads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.thread as ThreadDetail;
};

export const addComment = async (threadId: string, body: string) => {
  const { data } = await api.post(`/community/threads/${threadId}/comments`, { body });
  return data.comment as Comment;
};

export const toggleThreadLike = async (threadId: string) => {
  const { data } = await api.post(`/community/threads/${threadId}/like`);
  return data as { liked: boolean; likeCount: number };
};

export const toggleFollow = async (userId: string) => {
  const { data } = await api.post(`/community/users/${userId}/follow`);
  return data as { following: boolean };
};

export const deleteThread = async (id: string) => {
  await api.delete(`/community/threads/${id}`);
};

export const deleteComment = async (id: string) => {
  await api.delete(`/community/comments/${id}`);
};

export const communityImageUrl = (fileName: string) => {
  const apiBase = api.defaults.baseURL || "";
  const staticBase = apiBase.replace(/\/api\/?$/, "");
  return `${staticBase}/uploads/community/${fileName}`;
};
