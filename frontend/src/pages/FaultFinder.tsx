import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight } from "lucide-react";
import { fetchFaults } from "@/lib/fault-api";
import { useSEO } from "@/hooks/useSEO";
import type { FaultSummary } from "@/types/fault";

export const FaultFinder = () => {
  const [faults, setFaults] = useState<FaultSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useSEO({
    title: "Fault Finder — Diagnose Common Automation Faults",
    description: "Symptom-based troubleshooting: VFD trips, sensor failures, PLC output issues, HMI faults, and machine-specific problems — ranked causes with step-by-step checks.",
    path: "/fault-finder",
  });

  useEffect(() => {
    fetchFaults()
      .then(setFaults)
      .catch(() => setError("Couldn't load the fault finder. Is the API running?"))
      .finally(() => setIsLoading(false));
  }, []);

  const byCategory = useMemo(() => {
    const groups: Record<string, FaultSummary[]> = {};
    for (const f of faults) {
      groups[f.category] = groups[f.category] || [];
      groups[f.category].push(f);
    }
    return groups;
  }, [faults]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-signal-500">Fault Finder</p>
      <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Find your symptom, work through the causes</h1>
      <p className="mt-3 max-w-2xl text-ink-400">
        Each entry ranks likely causes by how often they're actually the culprit, with concrete steps to check
        each one — not just a generic list of possibilities.
      </p>

      {isLoading && <p className="mt-10 text-ink-400">Loading...</p>}
      {error && <p className="mt-10 text-red-400">{error}</p>}

      {Object.entries(byCategory).map(([category, list]) => (
        <div key={category} className="mt-12">
          <h2 className="font-display text-lg font-semibold text-ink-200">{category}</h2>
          <div className="mt-4 space-y-3">
            {list.map((f) => (
              <Link key={f.slug} to={`/fault-finder/${f.slug}`} className="panel-card flex items-center justify-between gap-4 hover:border-signal-500/50 transition-colors">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-signal-500" />
                  <div>
                    <h3 className="font-display font-semibold">{f.symptom}</h3>
                    <p className="mt-1 text-sm text-ink-400">{f.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink-400" />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
