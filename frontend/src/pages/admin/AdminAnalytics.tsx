import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Eye, MessageSquare, TrendingUp } from "lucide-react";
import { fetchAnalytics, type AnalyticsData } from "@/lib/admin-api";

export const AdminAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics()
      .then(setData)
      .catch(() => setError("Couldn't load analytics."));
  }, []);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!data) return <p className="text-ink-400">Loading analytics...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Analytics</h1>
      <p className="mt-1 text-sm text-ink-400">
        Real content performance, built from actual view/download/engagement counts — not a mock.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="panel-card">
          <Eye className="h-5 w-5 text-signal-500" />
          <p className="mt-2 font-mono text-2xl font-bold">{data.totalContentViews.toLocaleString()}</p>
          <p className="text-xs text-ink-400">Total lesson + machine views</p>
        </div>
        <div className="panel-card">
          <MessageSquare className="h-5 w-5 text-circuit-400" />
          <p className="mt-2 font-mono text-2xl font-bold">{data.community.threadCount.toLocaleString()}</p>
          <p className="text-xs text-ink-400">{data.community.commentCount} comments across all threads</p>
        </div>
        <div className="panel-card">
          <TrendingUp className="h-5 w-5 text-signal-500" />
          <p className="mt-2 font-mono text-2xl font-bold">
            {data.signupsByDay.reduce((sum, d) => sum + d.signups, 0)}
          </p>
          <p className="text-xs text-ink-400">New signups, last 30 days</p>
        </div>
      </div>

      <div className="panel-card mt-6">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
          Signups — last 30 days
        </h2>
        <div className="mt-4 h-64">
          {data.signupsByDay.length === 0 ? (
            <p className="text-sm text-ink-400">No signups in the last 30 days yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.signupsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-panel-700)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--color-ink-400)" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--color-ink-400)" }} />
                <Tooltip
                  contentStyle={{ background: "var(--color-panel-900)", border: "1px solid var(--color-panel-700)", borderRadius: 8 }}
                  labelStyle={{ color: "var(--color-ink-50)" }}
                />
                <Bar dataKey="signups" fill="var(--color-signal-500)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="panel-card">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">Top lessons</h2>
          <div className="mt-3 space-y-2">
            {data.topLessons.length === 0 && <p className="text-sm text-ink-400">No views yet.</p>}
            {data.topLessons.map((l) => (
              <div key={l._id} className="flex items-center justify-between text-sm">
                <span className="truncate text-ink-200">{l.title}</span>
                <span className="shrink-0 font-mono text-xs text-signal-500">{l.viewCount} views</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">Top machines</h2>
          <div className="mt-3 space-y-2">
            {data.topMachines.length === 0 && <p className="text-sm text-ink-400">No views yet.</p>}
            {data.topMachines.map((m) => (
              <div key={m._id} className="flex items-center justify-between text-sm">
                <span className="truncate text-ink-200">{m.title}</span>
                <span className="shrink-0 font-mono text-xs text-signal-500">{m.viewCount} views</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">Top downloads</h2>
          <div className="mt-3 space-y-2">
            {data.topDownloads.length === 0 && <p className="text-sm text-ink-400">No downloads yet.</p>}
            {data.topDownloads.map((d) => (
              <div key={d._id} className="flex items-center justify-between text-sm">
                <span className="truncate text-ink-200">{d.title}</span>
                <span className="shrink-0 font-mono text-xs text-signal-500">{d.downloadCount} downloads</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">Top community threads</h2>
          <div className="mt-3 space-y-2">
            {data.topThreads.length === 0 && <p className="text-sm text-ink-400">No threads yet.</p>}
            {data.topThreads.map((t) => (
              <div key={t._id} className="flex items-center justify-between text-sm">
                <span className="truncate text-ink-200">{t.title}</span>
                <span className="shrink-0 font-mono text-xs text-circuit-400">{t.viewCount} views · {t.commentCount} replies</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
