import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";
import { fetchMachine } from "@/lib/machine-api";
import { useSEO } from "@/hooks/useSEO";
import { buildTechArticleSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Machine } from "@/types/machine";

export const MachineDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);
    window.scrollTo(0, 0);
    fetchMachine(slug)
      .then(setMachine)
      .catch(() => setError("This machine couldn't be found."))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const breadcrumbItems = [
    { name: "Machine Library", path: "/machine-library" },
    { name: machine?.title ?? "Machine", path: `/machine-library/${slug}` },
  ];

  useSEO({
    title: machine ? machine.title : "Machine",
    description: machine?.summary ?? "A free industrial automation machine library entry.",
    path: `/machine-library/${slug}`,
    type: "article",
    structuredData: machine
      ? [
          buildTechArticleSchema({
            headline: machine.title,
            description: machine.summary,
            path: `/machine-library/${slug}`,
          }),
          buildBreadcrumbSchema(breadcrumbItems),
        ]
      : undefined,
  });

  // Build the section nav from the markdown's own ## headings, using the
  // same slugger rehype-slug uses internally so the anchor ids match exactly.
  const sections = useMemo(() => {
    if (!machine) return [];
    const slugger = new GithubSlugger();
    const headingLines = machine.content.match(/^## (.+)$/gm) || [];
    return headingLines.map((line) => {
      const title = line.replace(/^## /, "").trim();
      return { title, id: slugger.slug(title) };
    });
  }, [machine]);

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-ink-400">Loading machine...</div>;
  }

  if (error || !machine) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <p className="text-red-400">{error || "Machine not found."}</p>
        <Link to="/machine-library" className="mt-4 inline-block text-signal-500 hover:text-signal-400">
          &larr; Back to Machine Library
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={breadcrumbItems} />

      <Link to="/machine-library" className="text-sm text-ink-400 hover:text-signal-500">
        &larr; Machine Library
      </Link>

      <p className="mt-4 font-mono text-xs uppercase tracking-widest text-signal-500">{machine.category}</p>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{machine.title}</h1>
      <p className="mt-3 max-w-2xl text-ink-400">{machine.summary}</p>

      {machine.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {machine.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[var(--radius-panel)] border border-panel-700 px-2.5 py-1 font-mono text-xs text-ink-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-1 border-l border-panel-700 pl-4">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-400">On this page</p>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block py-1 text-sm text-ink-400 hover:text-signal-500 transition-colors"
              >
                {s.title}
              </a>
            ))}
          </div>
        </aside>

        <div className="lesson-content min-w-0">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
            {machine.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
