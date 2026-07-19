import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fetchTracks } from "@/lib/content-api";
import { trackIcons } from "@/lib/track-icons";
import { useSEO } from "@/hooks/useSEO";
import type { TrackMeta } from "@/types/content";

export const Learn = () => {
  const [tracks, setTracks] = useState<TrackMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useSEO({
    title: "Learn — PLC, HMI, SCADA, VFD, Servo, Sensors & More",
    description: "9 free learning tracks covering PLC programming, HMI, SCADA, VFD, servo systems, sensors, pneumatics, robotics, and industrial networking.",
    path: "/learn",
  });

  useEffect(() => {
    fetchTracks()
      .then(setTracks)
      .catch(() => setError("Couldn't load learning tracks. Is the API running?"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-signal-500">Learn</p>
      <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Every track, one place to start</h1>
      <p className="mt-3 max-w-2xl text-ink-400">
        Nine learning tracks covering everything from your first ladder rung to fieldbus network design —
        all free, all built from real machine logic.
      </p>

      {isLoading && <p className="mt-10 text-ink-400">Loading tracks...</p>}
      {error && <p className="mt-10 text-red-400">{error}</p>}

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => {
          const Icon = trackIcons[track.icon];
          return (
            <Link
              key={track.slug}
              to={`/learn/${track.slug}`}
              className="panel-card group flex flex-col hover:border-signal-500/50 transition-colors"
            >
              {Icon && <Icon className="h-6 w-6 text-signal-500" />}
              <h3 className="mt-4 font-display font-semibold">{track.label}</h3>
              <p className="mt-1.5 flex-1 text-sm text-ink-400">{track.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-mono text-ink-400">{track.lessonCount ?? 0} lessons</span>
                <span className="flex items-center gap-1 text-signal-500 opacity-0 transition-opacity group-hover:opacity-100">
                  Start <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
