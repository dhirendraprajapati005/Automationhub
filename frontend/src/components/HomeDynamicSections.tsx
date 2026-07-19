import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, MessageSquare, Wrench, CirclePlay, ArrowRight } from "lucide-react";
import { fetchDownloads } from "@/lib/download-api";
import { fetchThreads } from "@/lib/community-api";
import { fetchMachines } from "@/lib/machine-api";
import type { DownloadItem } from "@/types/download";
import type { ThreadSummary } from "@/types/community";
import type { MachineSummary } from "@/types/machine";

// Real, well-known industrial automation education channels — verified via
// web search, not invented. Links go to the channel's YouTube homepage
// rather than a specific video, since specific video IDs can't be verified
// to still exist without checking each one individually.
const YOUTUBE_CHANNELS = [
  { name: "RealPars", url: "https://www.youtube.com/@RealPars", description: "PLC, HMI, and process automation fundamentals" },
  { name: "TW Controls", url: "https://www.youtube.com/@TWControls", description: "Practical PLC programming and panel-building" },
  { name: "SolisPLC", url: "https://www.youtube.com/@SolisPLC", description: "PLC programming tutorials across multiple platforms" },
];

export const HomeDynamicSections = () => {
  const [popularDownloads, setPopularDownloads] = useState<DownloadItem[]>([]);
  const [latestQuestions, setLatestQuestions] = useState<ThreadSummary[]>([]);
  const [machineCategories, setMachineCategories] = useState<{ category: string; count: number }[]>([]);

  useEffect(() => {
    fetchDownloads().then((data) => setPopularDownloads(data.downloads.slice(0, 3))).catch(() => {});
    fetchThreads({ type: "question" }).then((threads) => setLatestQuestions(threads.slice(0, 3))).catch(() => {});
    fetchMachines()
      .then((machines: MachineSummary[]) => {
        const counts: Record<string, number> = {};
        machines.forEach((m) => { counts[m.category] = (counts[m.category] || 0) + 1; });
        setMachineCategories(Object.entries(counts).map(([category, count]) => ({ category, count })));
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Machine categories */}
      {machineCategories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Machine Library by category</h2>
            <Link to="/machine-library" className="text-sm text-signal-500 hover:text-signal-400">
              Browse all &rarr;
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {machineCategories.map((c) => (
              <Link key={c.category} to="/machine-library" className="panel-card hover:border-signal-500/50 transition-colors">
                <Wrench className="h-4 w-4 text-signal-500" />
                <h3 className="mt-2 font-display text-sm font-semibold">{c.category}</h3>
                <p className="mt-0.5 text-xs text-ink-400">{c.count} machine{c.count !== 1 ? "s" : ""}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Popular downloads + latest community questions, side by side */}
      <section className="border-t border-panel-700 bg-panel-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {popularDownloads.length > 0 && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold">Popular downloads</h2>
                  <Link to="/downloads" className="text-sm text-signal-500 hover:text-signal-400">
                    View all &rarr;
                  </Link>
                </div>
                <div className="mt-4 space-y-3">
                  {popularDownloads.map((d) => (
                    <div key={d._id} className="panel-card flex items-center gap-3">
                      <Download className="h-4 w-4 shrink-0 text-signal-500" />
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-semibold">{d.title}</p>
                        <p className="text-xs text-ink-400">{d.downloadCount} downloads</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {latestQuestions.length > 0 && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold">Latest community questions</h2>
                  <Link to="/community" className="text-sm text-signal-500 hover:text-signal-400">
                    View all &rarr;
                  </Link>
                </div>
                <div className="mt-4 space-y-3">
                  {latestQuestions.map((q) => (
                    <Link key={q._id} to={`/community/${q._id}`} className="panel-card flex items-center gap-3 hover:border-signal-500/50 transition-colors">
                      <MessageSquare className="h-4 w-4 shrink-0 text-circuit-400" />
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-semibold">{q.title}</p>
                        <p className="text-xs text-ink-400">{q.commentCount} replies</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Learn on YouTube — real, verified channels */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold">Learn on YouTube</h2>
        <p className="mt-1 text-sm text-ink-400">Channels worth following alongside AutomationHub.</p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {YOUTUBE_CHANNELS.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="panel-card group flex flex-col hover:border-signal-500/50 transition-colors"
            >
              <CirclePlay className="h-5 w-5 text-red-500" />
              <h3 className="mt-3 font-display font-semibold">{c.name}</h3>
              <p className="mt-1.5 flex-1 text-sm text-ink-400">{c.description}</p>
              <span className="mt-4 flex items-center gap-1 text-xs text-signal-500 opacity-0 transition-opacity group-hover:opacity-100">
                Visit channel <ArrowRight className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
};
