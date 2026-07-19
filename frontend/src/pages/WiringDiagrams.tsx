import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Cable, ArrowRight } from "lucide-react";
import { fetchWiringDiagrams } from "@/lib/wiring-diagram-api";
import { useSEO } from "@/hooks/useSEO";
import type { WiringDiagramSummary } from "@/types/wiringDiagram";

export const WiringDiagrams = () => {
  const [diagrams, setDiagrams] = useState<WiringDiagramSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useSEO({
    title: "Wiring Diagrams — Sensors, VFDs, Encoders & Safety Circuits",
    description: "A searchable library of real wiring references: NPN/PNP sensors, 4-20mA transmitters, VFD control terminals, encoders, solenoid valves, and e-stop safety circuits.",
    path: "/wiring-diagrams",
  });

  useEffect(() => {
    fetchWiringDiagrams()
      .then(setDiagrams)
      .catch(() => setError("Couldn't load wiring diagrams. Is the API running?"))
      .finally(() => setIsLoading(false));
  }, []);

  const byCategory = useMemo(() => {
    const groups: Record<string, WiringDiagramSummary[]> = {};
    for (const d of diagrams) {
      groups[d.category] = groups[d.category] || [];
      groups[d.category].push(d);
    }
    return groups;
  }, [diagrams]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-signal-500">Wiring Diagrams</p>
      <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Real wiring references, terminal by terminal</h1>
      <p className="mt-3 max-w-2xl text-ink-400">
        Sensors, transmitters, drives, encoders, actuators, and safety circuits — every diagram shows exactly
        which terminal connects to which, plus the mistakes that actually trip people up.
      </p>

      {isLoading && <p className="mt-10 text-ink-400">Loading...</p>}
      {error && <p className="mt-10 text-red-400">{error}</p>}

      {Object.entries(byCategory).map(([category, list]) => (
        <div key={category} className="mt-12">
          <h2 className="font-display text-lg font-semibold text-ink-200">{category}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((d) => (
              <Link key={d.slug} to={`/wiring-diagrams/${d.slug}`} className="panel-card group flex flex-col hover:border-signal-500/50 transition-colors">
                <Cable className="h-5 w-5 text-signal-500" />
                <h3 className="mt-3 font-display font-semibold">{d.title}</h3>
                <p className="mt-1.5 flex-1 text-sm text-ink-400">{d.description}</p>
                <span className="mt-4 flex items-center gap-1 text-xs text-signal-500 opacity-0 transition-opacity group-hover:opacity-100">
                  View diagram <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
