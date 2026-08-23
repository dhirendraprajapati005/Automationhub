import { api } from "@/lib/api";

export interface TrackMeta {
  slug: string;
  label: string;
}

export interface AdminLesson {
  _id: string;
  track: string;
  slug: string;
  title: string;
  summary: string;
  content?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  order: number;
  tags?: string[];
  isPublished: boolean;
  updatedAt: string;
}

export const fetchAllLessonsAdmin = async (): Promise<{ lessons: AdminLesson[]; tracks: TrackMeta[] }> => {
  const { data } = await api.get("/content/admin/lessons");
  return data;
};

export const fetchLessonByIdAdmin = async (id: string): Promise<AdminLesson> => {
  const { data } = await api.get(`/content/admin/lessons/${id}`);
  return data.lesson;
};

export interface LessonFormPayload {
  track: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  order: number;
  tags: string; // comma-separated in the form; the backend splits it into an array
  isPublished: boolean;
}

export const createLesson = async (payload: LessonFormPayload): Promise<AdminLesson> => {
  const { data } = await api.post("/content/admin/lessons", payload);
  return data.lesson;
};

export const updateLesson = async (id: string, payload: LessonFormPayload): Promise<AdminLesson> => {
  const { data } = await api.put(`/content/admin/lessons/${id}`, payload);
  return data.lesson;
};

export const deleteLesson = async (id: string) => {
  await api.delete(`/content/admin/lessons/${id}`);
};
