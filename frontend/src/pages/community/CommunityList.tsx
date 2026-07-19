import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Heart, Eye, Plus } from "lucide-react";
import { fetchThreads } from "@/lib/community-api";
import { useAuth } from "@/context/AuthContext";
import { useSEO } from "@/hooks/useSEO";
import type { ThreadSummary } from "@/types/community";

export const Community = () => {
  const { user } = useAuth();
  useSEO({
    title: "Community — Ask Questions, Share Projects",
    description: "Ask PLC and automation questions, share projects, and earn reputation in the AutomationHub community forum.",
    path: "/community",
  });
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [filter, setFilter] = useState<"" | "question" | "project">("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchThreads(filter ? { type: filter } : undefined)
      .then(setThreads)
      .catch(() => setError("Couldn't load the community forum. Is the API running?"))
      .finally(() => setIsLoading(false));
  }, [filter]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal-500">Community</p>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Ask, share, and learn together</h1>
          <p className="mt-3 max-w-2xl text-ink-400">Post questions or share projects. Earn reputation for contributing.</p>
        </div>
        {user ? (
          <Link to="/community/new" className="btn-primary shrink-0">
            <Plus className="h-4 w-4" /> New post
          </Link>
        ) : (
          <Link to="/login" className="btn-secondary shrink-0">
            Log in to post
          </Link>
        )}
      </div>

      <div className="mt-6 flex gap-2">
        {(["", "question", "project"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? "btn-primary py-1.5 px-3 text-xs" : "btn-secondary py-1.5 px-3 text-xs"}
          >
            {f === "" ? "All" : f === "question" ? "Questions" : "Projects"}
          </button>
        ))}
      </div>

      {isLoading && <p className="mt-10 text-ink-400">Loading...</p>}
      {error && <p className="mt-10 text-red-400">{error}</p>}
      {!isLoading && !error && threads.length === 0 && (
        <p className="mt-10 text-ink-400">Nothing posted yet — be the first.</p>
      )}

      <div className="mt-8 space-y-3">
        {threads.map((thread) => (
          <Link key={thread._id} to={`/community/${thread._id}`} className="panel-card block hover:border-signal-500/50 transition-colors">
            <div className="flex items-center gap-2 text-xs text-ink-400">
              <span className={thread.type === "question" ? "text-circuit-400" : "text-signal-500"}>
                {thread.type === "question" ? "Question" : "Project"}
              </span>
              <span>·</span>
              <span>{thread.author?.name ?? "Unknown"}</span>
            </div>
            <h3 className="mt-2 font-display font-semibold">{thread.title}</h3>
            <p className="mt-1 text-sm text-ink-400 line-clamp-2">{thread.body}</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-ink-400">
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" /> {thread.likeCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" /> {thread.commentCount}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> {thread.viewCount}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
