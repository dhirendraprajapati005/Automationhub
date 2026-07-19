import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Wrench, ArrowRight } from "lucide-react";
import { fetchMachines } from "@/lib/machine-api";
import { useSEO } from "@/hooks/useSEO";
import type { MachineSummary } from "@/types/machine";

export const MachineLibrary = () => {
  const [machines, setMachines] = useState<MachineSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useSEO({
    title: "Machine Library — Filling, Capping, Labeling & More",
    description:
      "10 industrial machines covered in depth: working principle, electrical wiring, pneumatics, PLC logic, sequence of operation, common faults, troubleshooting, and maintenance.",
    path: "/machine-library",
  });

  useEffect(() => {
    fetchMachines()
      .then(setMachines)
      .catch(() => setError("Couldn't load the machine library. Is the API running?"))
      .finally(() => setIsLoading(false));
  }, []);

  const byCategory = useMemo(() => {
    const groups: Record<string, MachineSummary[]> = {};
    for (const m of machines) {
      groups[m.category] = groups[m.category] || [];
      groups[m.category].push(m);
    }
    return groups;
  }, [machines]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-signal-500">Machine Library</p>
      <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Learn machines the way they actually run</h1>
      <p className="mt-3 max-w-2xl text-ink-400">
        Working principle through troubleshooting and maintenance — every machine covers electrical wiring,
        pneumatics, PLC logic, and the faults you'll actually see on the floor.
      </p>

      {isLoading && <p className="mt-10 text-ink-400">Loading machine library...</p>}
      {error && <p className="mt-10 text-red-400">{error}</p>}

      {Object.entries(byCategory).map(([category, list]) => (
        <div key={category} className="mt-12">
          <h2 className="font-display text-lg font-semibold text-ink-200">{category}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((machine) => (
              <Link
                key={machine.slug}
                to={`/machine-library/${machine.slug}`}
                className="panel-card group flex flex-col hover:border-signal-500/50 transition-colors"
              >
                <Wrench className="h-5 w-5 text-signal-500" />
                <h3 className="mt-3 font-display font-semibold">{machine.title}</h3>
                <p className="mt-1.5 flex-1 text-sm text-ink-400">{machine.summary}</p>
                <span className="mt-4 flex items-center gap-1 text-xs text-signal-500 opacity-0 transition-opacity group-hover:opacity-100">
                  View machine <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
