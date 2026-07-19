import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { fetchThreads, deleteThread } from "@/lib/community-api";
import type { ThreadSummary } from "@/types/community";

export const AdminCommunity = () => {
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setIsLoading(true);
    fetchThreads()
      .then(setThreads)
      .catch(() => setError("Couldn't load community threads."))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post and all its comments?")) return;
    await deleteThread(id);
    setThreads((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Community Moderation</h1>
      <p className="mt-1 text-sm text-ink-400">Remove posts that violate community guidelines.</p>

      {error && <p className="mt-4 text-red-400">{error}</p>}
      {isLoading && <p className="mt-6 text-ink-400">Loading threads...</p>}

      <div className="mt-6 space-y-2">
        {threads.map((thread) => (
          <div key={thread._id} className="panel-card flex items-center justify-between">
            <div>
              <p className="font-display text-sm font-semibold">{thread.title}</p>
              <p className="text-xs text-ink-400">
                {thread.type} · {thread.author?.name ?? "Unknown"} · {thread.commentCount} comments · {thread.likeCount} likes
              </p>
            </div>
            <button
              onClick={() => handleDelete(thread._id)}
              className="rounded-[var(--radius-panel)] border border-panel-700 p-2 text-red-400 hover:border-red-800 hover:bg-red-950/30"
              aria-label={`Delete ${thread.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {!isLoading && threads.length === 0 && <p className="text-ink-400">No threads posted yet.</p>}
      </div>
    </div>
  );
};
