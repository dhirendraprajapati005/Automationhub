export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface TrackMeta {
  slug: string;
  label: string;
  icon: string;
  description: string;
  lessonCount?: number;
}

export interface LessonSummary {
  slug: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  order: number;
  tags: string[];
}

export interface Lesson extends LessonSummary {
  track: string;
  content: string;
  author: string;
}

export interface LessonNeighbor {
  slug: string;
  title: string;
  order: number;
}
