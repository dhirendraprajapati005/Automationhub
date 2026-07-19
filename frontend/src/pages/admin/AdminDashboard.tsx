import { useEffect, useState } from "react";
import { Users, BookOpen, Wrench, Download } from "lucide-react";
import { fetchAdminStats, type AdminStats } from "@/lib/admin-api";

export const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch(() => setError("Couldn't load dashboard stats."));
  }, []);

  const cards = stats
    ? [
        { label: "Users", value: stats.userCount, icon: Users },
        { label: "Published lessons", value: stats.lessonCount, icon: BookOpen },
        { label: "Machine library entries", value: stats.machineCount, icon: Wrench },
        { label: "Downloads", value: stats.downloadCount, icon: Download },
      ]
    : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-400">Live counts across the platform.</p>

      {error && <p className="mt-6 text-red-400">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="panel-card">
            <Icon className="h-5 w-5 text-signal-500" />
            <p className="mt-3 font-mono text-3xl font-bold">{value.toLocaleString()}</p>
            <p className="mt-1 text-sm text-ink-400">{label}</p>
          </div>
        ))}
      </div>

      {stats && (
        <div className="mt-6 panel-card">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
            Total file downloads served
          </h3>
          <p className="mt-2 font-mono text-2xl font-bold text-signal-500">
            {stats.totalFileDownloads.toLocaleString()}
          </p>

          <h3 className="mt-6 font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
            Users by role
          </h3>
          <div className="mt-2 flex gap-6">
            {Object.entries(stats.usersByRole).map(([role, count]) => (
              <div key={role}>
                <p className="font-mono text-xl font-bold">{count}</p>
                <p className="text-xs capitalize text-ink-400">{role}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
