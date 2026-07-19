import { api } from "@/lib/api";
import type { TrackMeta, LessonSummary, Lesson, LessonNeighbor } from "@/types/content";

export const fetchTracks = async (): Promise<TrackMeta[]> => {
  const { data } = await api.get("/content/tracks");
  return data.tracks;
};

export const fetchTrackLessons = async (
  track: string
): Promise<{ track: TrackMeta; lessons: LessonSummary[] }> => {
  const { data } = await api.get(`/content/tracks/${track}`);
  return data;
};

export const fetchLesson = async (
  track: string,
  slug: string
): Promise<{ lesson: Lesson; prev: LessonNeighbor | null; next: LessonNeighbor | null }> => {
  const { data } = await api.get(`/content/tracks/${track}/${slug}`);
  return data;
};
