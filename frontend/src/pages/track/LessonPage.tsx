import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { fetchLesson } from "@/lib/content-api";
import { difficultyColor } from "@/lib/track-icons";
import { TRACKS } from "@/lib/track-icons-meta";
import { useSEO } from "@/hooks/useSEO";
import { buildTechArticleSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Lesson, LessonNeighbor } from "@/types/content";

export const LessonPage = () => {
  const { track, slug } = useParams<{ track: string; slug: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [prev, setPrev] = useState<LessonNeighbor | null>(null);
  const [next, setNext] = useState<LessonNeighbor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!track || !slug) return;
    setIsLoading(true);
    setError(null);
    window.scrollTo(0, 0);
    fetchLesson(track, slug)
      .then((data) => {
        setLesson(data.lesson);
        setPrev(data.prev);
        setNext(data.next);
      })
      .catch(() => setError("This lesson couldn't be found."))
      .finally(() => setIsLoading(false));
  }, [track, slug]);

  const trackLabel = TRACKS.find((t) => t.slug === track)?.label ?? track ?? "";
  const breadcrumbItems = [
    { name: "Learn", path: "/learn" },
    { name: trackLabel, path: `/learn/${track}` },
    { name: lesson?.title ?? "Lesson", path: `/learn/${track}/${slug}` },
  ];

  useSEO({
    title: lesson ? lesson.title : "Lesson",
    description: lesson?.summary ?? "A free industrial automation lesson.",
    path: `/learn/${track}/${slug}`,
    type: "article",
    structuredData: lesson
      ? [
          buildTechArticleSchema({
            headline: lesson.title,
            description: lesson.summary,
            path: `/learn/${track}/${slug}`,
          }),
          buildBreadcrumbSchema(breadcrumbItems),
        ]
      : undefined,
  });

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-ink-400">Loading lesson...</div>;
  }

  if (error || !lesson) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <p className="text-red-400">{error || "Lesson not found."}</p>
        <Link to={`/learn/${track}`} className="mt-4 inline-block text-signal-500 hover:text-signal-400">
          &larr; Back to track
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={breadcrumbItems} />

      <Link to={`/learn/${track}`} className="text-sm text-ink-400 hover:text-signal-500">
        &larr; Back to track
      </Link>

      <div className="mt-4 flex items-center gap-3 text-xs">
        <span className={difficultyColor[lesson.difficulty]}>{lesson.difficulty}</span>
        <span className="flex items-center gap-1 text-ink-400">
          <Clock className="h-3 w-3" /> {lesson.estimatedMinutes} min read
        </span>
      </div>

      <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{lesson.title}</h1>
      <p className="mt-3 text-ink-400">{lesson.summary}</p>

      {lesson.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {lesson.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[var(--radius-panel)] border border-panel-700 px-2.5 py-1 font-mono text-xs text-ink-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="lesson-content mt-10">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-3 border-t border-panel-700 pt-8 sm:grid-cols-2">
        {prev ? (
          <Link to={`/learn/${track}/${prev.slug}`} className="panel-card flex items-center gap-3">
            <ArrowLeft className="h-4 w-4 shrink-0 text-ink-400" />
            <div>
              <p className="text-xs text-ink-400">Previous</p>
              <p className="font-display text-sm font-semibold">{prev.title}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link to={`/learn/${track}/${next.slug}`} className="panel-card flex items-center justify-between gap-3 sm:text-right">
            <div className="sm:order-1">
              <p className="text-xs text-ink-400">Next</p>
              <p className="font-display text-sm font-semibold">{next.title}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-ink-400 sm:order-2" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
