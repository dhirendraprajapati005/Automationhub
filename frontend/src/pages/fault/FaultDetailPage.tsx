import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { fetchFault } from "@/lib/fault-api";
import { useSEO } from "@/hooks/useSEO";
import { buildBreadcrumbSchema, buildFAQSchema } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Fault, Likelihood } from "@/types/fault";

const likelihoodStyle: Record<Likelihood, string> = {
  "most likely": "border-signal-500 text-signal-500",
  possible: "border-circuit-500 text-circuit-400",
  "less common": "border-panel-600 text-ink-400",
};

export const FaultDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [fault, setFault] = useState<Fault | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState(0);

  const breadcrumbItems = [
    { name: "Fault Finder", path: "/fault-finder" },
    { name: fault?.symptom ?? "Fault", path: `/fault-finder/${slug}` },
  ];

  useSEO({
    title: fault ? fault.symptom : "Fault Finder",
    description: fault?.description ?? "A free industrial automation troubleshooting guide.",
    path: `/fault-finder/${slug}`,
    structuredData: fault
      ? [
          buildBreadcrumbSchema(breadcrumbItems),
          buildFAQSchema(fault.causes.map((c) => ({ question: c.cause, answer: c.fix }))),
        ]
      : undefined,
  });

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    window.scrollTo(0, 0);
    fetchFault(slug)
      .then(setFault)
      .catch(() => setError("This fault entry couldn't be found."))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-20 text-ink-400">Loading...</div>;

  if (error || !fault) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <p className="text-red-400">{error || "Fault entry not found."}</p>
        <Link to="/fault-finder" className="mt-4 inline-block text-signal-500 hover:text-signal-400">
          &larr; Back to Fault Finder
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={breadcrumbItems} />

      <Link to="/fault-finder" className="text-sm text-ink-400 hover:text-signal-500">
        &larr; Fault Finder
      </Link>

      <p className="mt-4 font-mono text-xs uppercase tracking-widest text-signal-500">{fault.category}</p>
      <h1 className="mt-2 font-display text-3xl font-bold">{fault.symptom}</h1>
      <p className="mt-2 max-w-2xl text-ink-400">{fault.description}</p>

      <p className="mt-8 text-xs uppercase tracking-wide text-ink-400">
        {fault.causes.length} possible causes, ranked by likelihood
      </p>

      <div className="mt-3 space-y-3">
        {fault.causes.map((cause, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="panel-card">
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs ${likelihoodStyle[cause.likelihood]}`}>
                    {cause.likelihood}
                  </span>
                  <span className="font-display font-semibold">{cause.cause}</span>
                </div>
                <ChevronDown className={`h-4 w-4 shrink-0 text-ink-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="mt-4 border-t border-panel-700 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Check</p>
                  <ul className="mt-2 space-y-2">
                    {cause.checkSteps.map((step, si) => (
                      <li key={si} className="flex gap-2 text-sm text-ink-200">
                        <span className="font-mono text-signal-500">{si + 1}.</span> {step}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 flex items-start gap-2 text-sm text-circuit-400">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span><span className="font-semibold">Fix:</span> {cause.fix}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
