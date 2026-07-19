import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertTriangle } from "lucide-react";
import { fetchWiringDiagram } from "@/lib/wiring-diagram-api";
import { TerminalWiringDiagram } from "@/components/ui/TerminalWiringDiagram";
import { useSEO } from "@/hooks/useSEO";
import { buildBreadcrumbSchema } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { WiringDiagram } from "@/types/wiringDiagram";

export const WiringDiagramDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [diagram, setDiagram] = useState<WiringDiagram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    { name: "Wiring Diagrams", path: "/wiring-diagrams" },
    { name: diagram?.title ?? "Diagram", path: `/wiring-diagrams/${slug}` },
  ];

  useSEO({
    title: diagram ? diagram.title : "Wiring Diagram",
    description: diagram?.description ?? "A free industrial automation wiring reference.",
    path: `/wiring-diagrams/${slug}`,
    structuredData: diagram ? buildBreadcrumbSchema(breadcrumbItems) : undefined,
  });

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    window.scrollTo(0, 0);
    fetchWiringDiagram(slug)
      .then(setDiagram)
      .catch(() => setError("This wiring diagram couldn't be found."))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) return <div className="mx-auto max-w-4xl px-4 py-20 text-ink-400">Loading...</div>;

  if (error || !diagram) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
        <p className="text-red-400">{error || "Diagram not found."}</p>
        <Link to="/wiring-diagrams" className="mt-4 inline-block text-signal-500 hover:text-signal-400">
          &larr; Back to Wiring Diagrams
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={breadcrumbItems} />

      <Link to="/wiring-diagrams" className="text-sm text-ink-400 hover:text-signal-500">
        &larr; Wiring Diagrams
      </Link>

      <p className="mt-4 font-mono text-xs uppercase tracking-widest text-signal-500">{diagram.category}</p>
      <h1 className="mt-2 font-display text-3xl font-bold">{diagram.title}</h1>
      <p className="mt-2 max-w-2xl text-ink-400">{diagram.description}</p>

      <div className="panel-card mt-8 overflow-x-auto">
        <TerminalWiringDiagram
          deviceLabel={diagram.deviceLabel}
          deviceTerminals={diagram.deviceTerminals}
          controllerLabel={diagram.controllerLabel}
          controllerTerminals={diagram.controllerTerminals}
          connections={diagram.connections}
        />
      </div>

      {diagram.connections.some((c) => c.note) && (
        <div className="mt-4 space-y-1.5">
          {diagram.connections.filter((c) => c.note).map((c, i) => (
            <p key={i} className="text-xs text-ink-400">
              <span className="font-mono text-circuit-400">{c.deviceTerminalId} → {c.controllerTerminalId}:</span> {c.note}
            </p>
          ))}
        </div>
      )}

      <div className="lesson-content mt-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{diagram.notes}</ReactMarkdown>
      </div>

      {diagram.commonMistakes.length > 0 && (
        <div className="panel-card mt-8">
          <h3 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-signal-500">
            <AlertTriangle className="h-4 w-4" /> Common mistakes
          </h3>
          <ul className="mt-3 space-y-2">
            {diagram.commonMistakes.map((m, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-200">
                <span className="text-signal-500">•</span> {m}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
