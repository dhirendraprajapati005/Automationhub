import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { fetchTrackLessons } from "@/lib/content-api";
import { trackIcons, difficultyColor } from "@/lib/track-icons";
import { useSEO } from "@/hooks/useSEO";
import { buildBreadcrumbSchema } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { TrackMeta, LessonSummary } from "@/types/content";

export const TrackPage = () => {
  const { track: trackSlug } = useParams<{ track: string }>();
  const [track, setTrack] = useState<TrackMeta | null>(null);
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    { name: "Learn", path: "/learn" },
    { name: track?.label ?? trackSlug ?? "Track", path: `/learn/${trackSlug}` },
  ];

  useSEO({
    title: track ? track.label : "Learning Track",
    description: track?.description ?? "A free industrial automation learning track.",
    path: `/learn/${trackSlug}`,
    structuredData: track ? buildBreadcrumbSchema(breadcrumbItems) : undefined,
  });

  useEffect(() => {
    if (!trackSlug) return;
    setIsLoading(true);
    setError(null);
    fetchTrackLessons(trackSlug)
      .then(({ track, lessons }) => {
        setTrack(track);
        setLessons(lessons);
      })
      .catch(() => setError("This track couldn't be loaded, or doesn't exist yet."))
      .finally(() => setIsLoading(false));
  }, [trackSlug]);

  if (isLoading) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-ink-400">Loading track...</div>;
  }

  if (error || !track) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
        <p className="text-red-400">{error || "Track not found."}</p>
        <Link to="/learn" className="mt-4 inline-block text-signal-500 hover:text-signal-400">
          &larr; Back to all tracks
        </Link>
      </div>
    );
  }

  const Icon = trackIcons[track.icon];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={breadcrumbItems} />

      <Link to="/learn" className="text-sm text-ink-400 hover:text-signal-500">
        &larr; All tracks
      </Link>

      <div className="mt-4 flex items-start gap-4">
        {Icon && (
          <div className="rounded-[var(--radius-panel)] border border-panel-700 bg-panel-900 p-3">
            <Icon className="h-6 w-6 text-signal-500" />
          </div>
        )}
        <div>
          <h1 className="font-display text-3xl font-bold">{track.label}</h1>
          <p className="mt-2 max-w-xl text-ink-400">{track.description}</p>
        </div>
      </div>

      <div className="mt-10 space-y-3">
        {lessons.length === 0 && (
          <p className="text-ink-400">No lessons published in this track yet — check back soon.</p>
        )}
        {lessons.map((lesson, i) => (
          <Link
            key={lesson.slug}
            to={`/learn/${trackSlug}/${lesson.slug}`}
            className="panel-card flex items-center justify-between gap-4 hover:border-signal-500/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <span className="font-mono text-sm text-ink-400">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display font-semibold leading-snug">{lesson.title}</h3>
                <p className="mt-1 text-sm text-ink-400">{lesson.summary}</p>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className={difficultyColor[lesson.difficulty]}>{lesson.difficulty}</span>
                  <span className="flex items-center gap-1 text-ink-400">
                    <Clock className="h-3 w-3" /> {lesson.estimatedMinutes} min
                  </span>
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-ink-400" />
          </Link>
        ))}
      </div>
    </div>
  );
};
